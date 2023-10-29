
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35731/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    const file = "src\\App.svelte";

    // (388:2) {#if currentPage === "home"}
    function create_if_block_1(ctx) {
    	let div22;
    	let div4;
    	let h30;
    	let t1;
    	let div0;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let label2;
    	let t9;
    	let input2;
    	let t10;
    	let div3;
    	let button;
    	let t12;
    	let div21;
    	let h31;
    	let t14;
    	let div7;
    	let div6;
    	let img0;
    	let img0_src_value;
    	let t15;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let div5;
    	let p;
    	let t17_value = /*formData*/ ctx[0].name + "";
    	let t17;
    	let t18;
    	let h32;
    	let t20;
    	let div20;
    	let div19;
    	let div8;
    	let img2;
    	let img2_src_value;
    	let t21;
    	let div18;
    	let div17;
    	let div10;
    	let img3;
    	let img3_src_value;
    	let t22;
    	let div9;
    	let t23_value = /*formData*/ ctx[0].name + "";
    	let t23;
    	let t24;
    	let div12;
    	let img4;
    	let img4_src_value;
    	let t25;
    	let div11;
    	let t26_value = /*formData*/ ctx[0].address + "";
    	let t26;
    	let t27;
    	let div14;
    	let img5;
    	let img5_src_value;
    	let t28;
    	let div13;
    	let t29_value = /*formData*/ ctx[0].email + "";
    	let t29;
    	let t30;
    	let div16;
    	let img6;
    	let img6_src_value;
    	let t31;
    	let div15;
    	let t32_value = /*formData*/ ctx[0].phoneNumber + "";
    	let t32;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div22 = element("div");
    			div4 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Your Business Card:";
    			t1 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Address:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Phone Number:";
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "Submit";
    			t12 = space();
    			div21 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Front Side:";
    			t14 = space();
    			div7 = element("div");
    			div6 = element("div");
    			img0 = element("img");
    			t15 = space();
    			img1 = element("img");
    			t16 = space();
    			div5 = element("div");
    			p = element("p");
    			t17 = text(t17_value);
    			t18 = space();
    			h32 = element("h3");
    			h32.textContent = "Reverse Side:";
    			t20 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div8 = element("div");
    			img2 = element("img");
    			t21 = space();
    			div18 = element("div");
    			div17 = element("div");
    			div10 = element("div");
    			img3 = element("img");
    			t22 = space();
    			div9 = element("div");
    			t23 = text(t23_value);
    			t24 = space();
    			div12 = element("div");
    			img4 = element("img");
    			t25 = space();
    			div11 = element("div");
    			t26 = text(t26_value);
    			t27 = space();
    			div14 = element("div");
    			img5 = element("img");
    			t28 = space();
    			div13 = element("div");
    			t29 = text(t29_value);
    			t30 = space();
    			div16 = element("div");
    			img6 = element("img");
    			t31 = space();
    			div15 = element("div");
    			t32 = text(t32_value);
    			attr_dev(h30, "class", "svelte-455g50");
    			add_location(h30, file, 390, 3, 6781);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-455g50");
    			add_location(label0, file, 392, 2, 6842);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "placeholder", "Your Name");
    			attr_dev(input0, "class", "svelte-455g50");
    			add_location(input0, file, 393, 2, 6877);
    			attr_dev(div0, "class", "form-group svelte-455g50");
    			add_location(div0, file, 391, 3, 6814);
    			attr_dev(label1, "for", "address");
    			attr_dev(label1, "class", "svelte-455g50");
    			add_location(label1, file, 397, 2, 7008);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "address");
    			attr_dev(input1, "placeholder", "Your Address");
    			attr_dev(input1, "class", "svelte-455g50");
    			add_location(input1, file, 398, 2, 7049);
    			attr_dev(div1, "class", "form-group svelte-455g50");
    			add_location(div1, file, 396, 3, 6980);
    			attr_dev(label2, "for", "phoneNumber");
    			attr_dev(label2, "class", "svelte-455g50");
    			add_location(label2, file, 401, 2, 7184);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "phoneNumber");
    			attr_dev(input2, "placeholder", "Your Phone Number with Country Code");
    			attr_dev(input2, "class", "svelte-455g50");
    			add_location(input2, file, 402, 2, 7234);
    			attr_dev(div2, "class", "form-group svelte-455g50");
    			add_location(div2, file, 400, 3, 7156);
    			attr_dev(button, "class", "svelte-455g50");
    			add_location(button, file, 407, 2, 7411);
    			attr_dev(div3, "class", "button-section svelte-455g50");
    			add_location(div3, file, 406, 3, 7379);
    			attr_dev(div4, "class", "input-section svelte-455g50");
    			add_location(div4, file, 389, 1, 6749);
    			attr_dev(h31, "class", "svelte-455g50");
    			add_location(h31, file, 412, 3, 7516);
    			attr_dev(img0, "class", "icon5 svelte-455g50");
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = "./public/9-3@2x.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 415, 3, 7623);
    			attr_dev(img1, "class", "icon6 svelte-455g50");
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = "./public/4-4@2x.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 418, 3, 7690);
    			attr_dev(p, "class", "fauget1 svelte-455g50");
    			add_location(p, file, 422, 5, 7794);
    			attr_dev(div5, "class", "fauget-catering1 svelte-455g50");
    			add_location(div5, file, 421, 3, 7757);
    			attr_dev(div6, "class", "front3 svelte-455g50");
    			attr_dev(div6, "id", "frontContainer");
    			add_location(div6, file, 414, 2, 7578);
    			attr_dev(div7, "class", "business-card-front svelte-455g50");
    			add_location(div7, file, 413, 3, 7541);
    			attr_dev(h32, "class", "svelte-455g50");
    			add_location(h32, file, 426, 5, 7875);
    			attr_dev(img2, "class", "icon svelte-455g50");
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = "./public/8-2@2x.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 430, 6, 8012);
    			attr_dev(div8, "class", "frame svelte-455g50");
    			add_location(div8, file, 429, 4, 7985);
    			attr_dev(img3, "class", "icon1 svelte-455g50");
    			attr_dev(img3, "alt", "");
    			if (!src_url_equal(img3.src, img3_src_value = "./public/4-3@2x.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 435, 7, 8167);
    			attr_dev(div9, "class", "fauget-catering svelte-455g50");
    			add_location(div9, file, 438, 7, 8240);
    			attr_dev(div10, "class", "frame3 svelte-455g50");
    			add_location(div10, file, 434, 5, 8138);
    			attr_dev(img4, "class", "icon2 svelte-455g50");
    			attr_dev(img4, "alt", "");
    			if (!src_url_equal(img4.src, img4_src_value = "./public/7-1@2x.png")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file, 443, 7, 8356);
    			attr_dev(div11, "class", "nagpurmaharashtraindia svelte-455g50");
    			add_location(div11, file, 446, 7, 8429);
    			attr_dev(div12, "class", "frame4 svelte-455g50");
    			add_location(div12, file, 442, 5, 8327);
    			attr_dev(img5, "class", "icon2 svelte-455g50");
    			attr_dev(img5, "alt", "");
    			if (!src_url_equal(img5.src, img5_src_value = "./public/6-1@2x.png")) attr_dev(img5, "src", img5_src_value);
    			add_location(img5, file, 449, 7, 8538);
    			attr_dev(div13, "class", "nagpurmaharashtraindia svelte-455g50");
    			add_location(div13, file, 452, 7, 8611);
    			attr_dev(div14, "class", "frame5 svelte-455g50");
    			add_location(div14, file, 448, 5, 8509);
    			attr_dev(img6, "class", "icon2 svelte-455g50");
    			attr_dev(img6, "alt", "");
    			if (!src_url_equal(img6.src, img6_src_value = "./public/5-1@2x.png")) attr_dev(img6, "src", img6_src_value);
    			add_location(img6, file, 455, 7, 8718);
    			attr_dev(div15, "class", "nagpurmaharashtraindia svelte-455g50");
    			add_location(div15, file, 458, 7, 8791);
    			attr_dev(div16, "class", "frame6 svelte-455g50");
    			add_location(div16, file, 454, 5, 8689);
    			attr_dev(div17, "class", "frame2 svelte-455g50");
    			add_location(div17, file, 433, 6, 8111);
    			attr_dev(div18, "class", "frame1 svelte-455g50");
    			add_location(div18, file, 432, 4, 8083);
    			attr_dev(div19, "class", "back3 svelte-455g50");
    			attr_dev(div19, "id", "backContainer");
    			add_location(div19, file, 428, 3, 7941);
    			attr_dev(div20, "class", "business-card-back svelte-455g50");
    			add_location(div20, file, 427, 5, 7904);
    			attr_dev(div21, "class", "preview-section svelte-455g50");
    			add_location(div21, file, 410, 1, 7479);
    			attr_dev(div22, "class", "business-card-container svelte-455g50");
    			add_location(div22, file, 388, 2, 6709);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div22, anchor);
    			append_dev(div22, div4);
    			append_dev(div4, h30);
    			append_dev(div4, t1);
    			append_dev(div4, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*formData*/ ctx[0].name);
    			append_dev(div4, t4);
    			append_dev(div4, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*formData*/ ctx[0].address);
    			append_dev(div4, t7);
    			append_dev(div4, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t9);
    			append_dev(div2, input2);
    			set_input_value(input2, /*formData*/ ctx[0].phoneNumber);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    			append_dev(div22, t12);
    			append_dev(div22, div21);
    			append_dev(div21, h31);
    			append_dev(div21, t14);
    			append_dev(div21, div7);
    			append_dev(div7, div6);
    			append_dev(div6, img0);
    			append_dev(div6, t15);
    			append_dev(div6, img1);
    			append_dev(div6, t16);
    			append_dev(div6, div5);
    			append_dev(div5, p);
    			append_dev(p, t17);
    			append_dev(div21, t18);
    			append_dev(div21, h32);
    			append_dev(div21, t20);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div8);
    			append_dev(div8, img2);
    			append_dev(div19, t21);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div10);
    			append_dev(div10, img3);
    			append_dev(div10, t22);
    			append_dev(div10, div9);
    			append_dev(div9, t23);
    			append_dev(div17, t24);
    			append_dev(div17, div12);
    			append_dev(div12, img4);
    			append_dev(div12, t25);
    			append_dev(div12, div11);
    			append_dev(div11, t26);
    			append_dev(div17, t27);
    			append_dev(div17, div14);
    			append_dev(div14, img5);
    			append_dev(div14, t28);
    			append_dev(div14, div13);
    			append_dev(div13, t29);
    			append_dev(div17, t30);
    			append_dev(div17, div16);
    			append_dev(div16, img6);
    			append_dev(div16, t31);
    			append_dev(div16, div15);
    			append_dev(div15, t32);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(button, "click", /*submitForm*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formData*/ 1 && input0.value !== /*formData*/ ctx[0].name) {
    				set_input_value(input0, /*formData*/ ctx[0].name);
    			}

    			if (dirty & /*formData*/ 1 && input1.value !== /*formData*/ ctx[0].address) {
    				set_input_value(input1, /*formData*/ ctx[0].address);
    			}

    			if (dirty & /*formData*/ 1 && input2.value !== /*formData*/ ctx[0].phoneNumber) {
    				set_input_value(input2, /*formData*/ ctx[0].phoneNumber);
    			}

    			if (dirty & /*formData*/ 1 && t17_value !== (t17_value = /*formData*/ ctx[0].name + "")) set_data_dev(t17, t17_value);
    			if (dirty & /*formData*/ 1 && t23_value !== (t23_value = /*formData*/ ctx[0].name + "")) set_data_dev(t23, t23_value);
    			if (dirty & /*formData*/ 1 && t26_value !== (t26_value = /*formData*/ ctx[0].address + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*formData*/ 1 && t29_value !== (t29_value = /*formData*/ ctx[0].email + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*formData*/ 1 && t32_value !== (t32_value = /*formData*/ ctx[0].phoneNumber + "")) set_data_dev(t32, t32_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div22);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(388:2) {#if currentPage === \\\"home\\\"}",
    		ctx
    	});

    	return block;
    }

    // (471:2) {#if showPrompt}
    function create_if_block(ctx) {
    	let div17;
    	let div16;
    	let p0;
    	let t1;
    	let h30;
    	let t3;
    	let div2;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div0;
    	let p1;
    	let t6_value = /*formData*/ ctx[0].name + "";
    	let t6;
    	let t7;
    	let h31;
    	let t9;
    	let div15;
    	let div14;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t10;
    	let div13;
    	let div12;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t11;
    	let div4;
    	let t12_value = /*formData*/ ctx[0].name + "";
    	let t12;
    	let t13;
    	let div7;
    	let img4;
    	let img4_src_value;
    	let t14;
    	let div6;
    	let t15_value = /*formData*/ ctx[0].address + "";
    	let t15;
    	let t16;
    	let div9;
    	let img5;
    	let img5_src_value;
    	let t17;
    	let div8;
    	let t18_value = /*formData*/ ctx[0].email + "";
    	let t18;
    	let t19;
    	let div11;
    	let img6;
    	let img6_src_value;
    	let t20;
    	let div10;
    	let t21_value = /*formData*/ ctx[0].phoneNumber + "";
    	let t21;
    	let t22;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div17 = element("div");
    			div16 = element("div");
    			p0 = element("p");
    			p0.textContent = "Form Submitted!";
    			t1 = space();
    			h30 = element("h3");
    			h30.textContent = "Front Side:";
    			t3 = space();
    			div2 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t4 = space();
    			img1 = element("img");
    			t5 = space();
    			div0 = element("div");
    			p1 = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "Reverse Side:";
    			t9 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div3 = element("div");
    			img2 = element("img");
    			t10 = space();
    			div13 = element("div");
    			div12 = element("div");
    			div5 = element("div");
    			img3 = element("img");
    			t11 = space();
    			div4 = element("div");
    			t12 = text(t12_value);
    			t13 = space();
    			div7 = element("div");
    			img4 = element("img");
    			t14 = space();
    			div6 = element("div");
    			t15 = text(t15_value);
    			t16 = space();
    			div9 = element("div");
    			img5 = element("img");
    			t17 = space();
    			div8 = element("div");
    			t18 = text(t18_value);
    			t19 = space();
    			div11 = element("div");
    			img6 = element("img");
    			t20 = space();
    			div10 = element("div");
    			t21 = text(t21_value);
    			t22 = space();
    			button = element("button");
    			button.textContent = "Close";
    			add_location(p0, file, 473, 3, 9037);
    			add_location(h30, file, 474, 3, 9064);
    			attr_dev(img0, "class", "icon5 svelte-455g50");
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = "./public/9-3@2x.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 477, 3, 9173);
    			attr_dev(img1, "class", "icon6 svelte-455g50");
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = "./public/4-4@2x.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 480, 3, 9240);
    			attr_dev(p1, "class", "fauget1 svelte-455g50");
    			add_location(p1, file, 484, 5, 9344);
    			attr_dev(div0, "class", "fauget-catering1 svelte-455g50");
    			add_location(div0, file, 483, 3, 9307);
    			attr_dev(div1, "class", "front3 svelte-455g50");
    			attr_dev(div1, "id", "frontContainer");
    			add_location(div1, file, 476, 3, 9128);
    			attr_dev(div2, "class", "business-card-front svelte-455g50");
    			add_location(div2, file, 475, 4, 9090);
    			add_location(h31, file, 488, 3, 9424);
    			attr_dev(img2, "class", "icon svelte-455g50");
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = "./public/8-2@2x.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 492, 6, 9559);
    			attr_dev(div3, "class", "frame svelte-455g50");
    			add_location(div3, file, 491, 4, 9532);
    			attr_dev(img3, "class", "icon1 svelte-455g50");
    			attr_dev(img3, "alt", "");
    			if (!src_url_equal(img3.src, img3_src_value = "./public/4-3@2x.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 497, 7, 9714);
    			attr_dev(div4, "class", "fauget-catering svelte-455g50");
    			add_location(div4, file, 500, 7, 9787);
    			attr_dev(div5, "class", "frame3 svelte-455g50");
    			add_location(div5, file, 496, 5, 9685);
    			attr_dev(img4, "class", "icon2 svelte-455g50");
    			attr_dev(img4, "alt", "");
    			if (!src_url_equal(img4.src, img4_src_value = "./public/7-1@2x.png")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file, 505, 7, 9903);
    			attr_dev(div6, "class", "nagpurmaharashtraindia svelte-455g50");
    			add_location(div6, file, 508, 7, 9976);
    			attr_dev(div7, "class", "frame4 svelte-455g50");
    			add_location(div7, file, 504, 5, 9874);
    			attr_dev(img5, "class", "icon2 svelte-455g50");
    			attr_dev(img5, "alt", "");
    			if (!src_url_equal(img5.src, img5_src_value = "./public/6-1@2x.png")) attr_dev(img5, "src", img5_src_value);
    			add_location(img5, file, 511, 7, 10085);
    			attr_dev(div8, "class", "nagpurmaharashtraindia svelte-455g50");
    			add_location(div8, file, 514, 7, 10158);
    			attr_dev(div9, "class", "frame5 svelte-455g50");
    			add_location(div9, file, 510, 5, 10056);
    			attr_dev(img6, "class", "icon2 svelte-455g50");
    			attr_dev(img6, "alt", "");
    			if (!src_url_equal(img6.src, img6_src_value = "./public/5-1@2x.png")) attr_dev(img6, "src", img6_src_value);
    			add_location(img6, file, 517, 7, 10265);
    			attr_dev(div10, "class", "nagpurmaharashtraindia svelte-455g50");
    			add_location(div10, file, 520, 7, 10338);
    			attr_dev(div11, "class", "frame6 svelte-455g50");
    			add_location(div11, file, 516, 5, 10236);
    			attr_dev(div12, "class", "frame2 svelte-455g50");
    			add_location(div12, file, 495, 6, 9658);
    			attr_dev(div13, "class", "frame1 svelte-455g50");
    			add_location(div13, file, 494, 4, 9630);
    			attr_dev(div14, "class", "back3 svelte-455g50");
    			attr_dev(div14, "id", "backContainer");
    			add_location(div14, file, 490, 3, 9488);
    			attr_dev(div15, "class", "business-card-back svelte-455g50");
    			add_location(div15, file, 489, 3, 9451);
    			add_location(button, file, 526, 3, 10472);
    			attr_dev(div16, "class", "prompt-content svelte-455g50");
    			add_location(div16, file, 472, 1, 9004);
    			attr_dev(div17, "class", "prompt svelte-455g50");
    			add_location(div17, file, 471, 2, 8981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div16);
    			append_dev(div16, p0);
    			append_dev(div16, t1);
    			append_dev(div16, h30);
    			append_dev(div16, t3);
    			append_dev(div16, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t4);
    			append_dev(div1, img1);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, p1);
    			append_dev(p1, t6);
    			append_dev(div16, t7);
    			append_dev(div16, h31);
    			append_dev(div16, t9);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div3);
    			append_dev(div3, img2);
    			append_dev(div14, t10);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, t12);
    			append_dev(div12, t13);
    			append_dev(div12, div7);
    			append_dev(div7, img4);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, t15);
    			append_dev(div12, t16);
    			append_dev(div12, div9);
    			append_dev(div9, img5);
    			append_dev(div9, t17);
    			append_dev(div9, div8);
    			append_dev(div8, t18);
    			append_dev(div12, t19);
    			append_dev(div12, div11);
    			append_dev(div11, img6);
    			append_dev(div11, t20);
    			append_dev(div11, div10);
    			append_dev(div10, t21);
    			append_dev(div16, t22);
    			append_dev(div16, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*closePrompt*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formData*/ 1 && t6_value !== (t6_value = /*formData*/ ctx[0].name + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*formData*/ 1 && t12_value !== (t12_value = /*formData*/ ctx[0].name + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*formData*/ 1 && t15_value !== (t15_value = /*formData*/ ctx[0].address + "")) set_data_dev(t15, t15_value);
    			if (dirty & /*formData*/ 1 && t18_value !== (t18_value = /*formData*/ ctx[0].email + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*formData*/ 1 && t21_value !== (t21_value = /*formData*/ ctx[0].phoneNumber + "")) set_data_dev(t21, t21_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(471:2) {#if showPrompt}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*currentPage*/ ctx[2] === "home" && create_if_block_1(ctx);
    	let if_block1 = /*showPrompt*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*currentPage*/ ctx[2] === "home") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*showPrompt*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let formData = {
    		name: "Company Name",
    		email: "Your@email.in",
    		address: "Address",
    		phoneNumber: "PhoneNumber"
    	};

    	let showPrompt = false;
    	let currentPage = "home";

    	const changePage = page => {
    		$$invalidate(2, currentPage = page);
    	};

    	const submitForm = () => {
    		$$invalidate(1, showPrompt = true);
    	};

    	const closePrompt = () => {
    		$$invalidate(1, showPrompt = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		formData.name = this.value;
    		$$invalidate(0, formData);
    	}

    	function input1_input_handler() {
    		formData.address = this.value;
    		$$invalidate(0, formData);
    	}

    	function input2_input_handler() {
    		formData.phoneNumber = this.value;
    		$$invalidate(0, formData);
    	}

    	$$self.$capture_state = () => ({
    		formData,
    		showPrompt,
    		currentPage,
    		changePage,
    		submitForm,
    		closePrompt
    	});

    	$$self.$inject_state = $$props => {
    		if ('formData' in $$props) $$invalidate(0, formData = $$props.formData);
    		if ('showPrompt' in $$props) $$invalidate(1, showPrompt = $$props.showPrompt);
    		if ('currentPage' in $$props) $$invalidate(2, currentPage = $$props.currentPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		formData,
    		showPrompt,
    		currentPage,
    		submitForm,
    		closePrompt,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
