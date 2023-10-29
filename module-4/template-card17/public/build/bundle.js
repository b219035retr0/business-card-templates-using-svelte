
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35732/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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

    // (412:2) {#if currentPage === "home"}
    function create_if_block_1(ctx) {
    	let div25;
    	let div6;
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
    	let label3;
    	let t12;
    	let input3;
    	let t13;
    	let div4;
    	let label4;
    	let t15;
    	let input4;
    	let t16;
    	let div5;
    	let button;
    	let t18;
    	let div24;
    	let h31;
    	let t20;
    	let div13;
    	let div12;
    	let section0;
    	let img0;
    	let img0_src_value;
    	let t21;
    	let div11;
    	let div10;
    	let div7;
    	let img1;
    	let img1_src_value;
    	let t22;
    	let div9;
    	let div8;
    	let p0;
    	let t23_value = /*formData*/ ctx[0].name + "";
    	let t23;
    	let t24;
    	let p1;
    	let t25_value = /*formData*/ ctx[0].website + "";
    	let t25;
    	let t26;
    	let h32;
    	let t28;
    	let div23;
    	let div22;
    	let section1;
    	let div15;
    	let div14;
    	let p2;
    	let t29_value = /*formData*/ ctx[0].name + "";
    	let t29;
    	let t30;
    	let p3;
    	let t31_value = /*formData*/ ctx[0].designation + "";
    	let t31;
    	let t32;
    	let img2;
    	let img2_src_value;
    	let t33;
    	let img3;
    	let img3_src_value;
    	let t34;
    	let div16;
    	let t35;
    	let div20;
    	let div17;
    	let t36_value = /*formData*/ ctx[0].phoneNumber + "";
    	let t36;
    	let t37;
    	let div18;
    	let t38_value = /*formData*/ ctx[0].website + "";
    	let t38;
    	let t39;
    	let div19;
    	let t40_value = /*formData*/ ctx[0].address + "";
    	let t40;
    	let t41;
    	let div21;
    	let img4;
    	let img4_src_value;
    	let t42;
    	let img5;
    	let img5_src_value;
    	let t43;
    	let img6;
    	let img6_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div25 = element("div");
    			div6 = element("div");
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
    			label1.textContent = "Designation:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Address:";
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			div3 = element("div");
    			label3 = element("label");
    			label3.textContent = "Phone Number:";
    			t12 = space();
    			input3 = element("input");
    			t13 = space();
    			div4 = element("div");
    			label4 = element("label");
    			label4.textContent = "Website:";
    			t15 = space();
    			input4 = element("input");
    			t16 = space();
    			div5 = element("div");
    			button = element("button");
    			button.textContent = "Submit";
    			t18 = space();
    			div24 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Front Side:";
    			t20 = space();
    			div13 = element("div");
    			div12 = element("div");
    			section0 = element("section");
    			img0 = element("img");
    			t21 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div7 = element("div");
    			img1 = element("img");
    			t22 = space();
    			div9 = element("div");
    			div8 = element("div");
    			p0 = element("p");
    			t23 = text(t23_value);
    			t24 = space();
    			p1 = element("p");
    			t25 = text(t25_value);
    			t26 = space();
    			h32 = element("h3");
    			h32.textContent = "Reverse Side:";
    			t28 = space();
    			div23 = element("div");
    			div22 = element("div");
    			section1 = element("section");
    			div15 = element("div");
    			div14 = element("div");
    			p2 = element("p");
    			t29 = text(t29_value);
    			t30 = space();
    			p3 = element("p");
    			t31 = text(t31_value);
    			t32 = space();
    			img2 = element("img");
    			t33 = space();
    			img3 = element("img");
    			t34 = space();
    			div16 = element("div");
    			t35 = space();
    			div20 = element("div");
    			div17 = element("div");
    			t36 = text(t36_value);
    			t37 = space();
    			div18 = element("div");
    			t38 = text(t38_value);
    			t39 = space();
    			div19 = element("div");
    			t40 = text(t40_value);
    			t41 = space();
    			div21 = element("div");
    			img4 = element("img");
    			t42 = space();
    			img5 = element("img");
    			t43 = space();
    			img6 = element("img");
    			attr_dev(h30, "class", "svelte-dw8ht");
    			add_location(h30, file, 414, 3, 7351);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-dw8ht");
    			add_location(label0, file, 416, 2, 7412);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "placeholder", "Your Name");
    			attr_dev(input0, "class", "svelte-dw8ht");
    			add_location(input0, file, 417, 2, 7447);
    			attr_dev(div0, "class", "form-group svelte-dw8ht");
    			add_location(div0, file, 415, 3, 7384);
    			attr_dev(label1, "for", "designation");
    			attr_dev(label1, "class", "svelte-dw8ht");
    			add_location(label1, file, 420, 2, 7573);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "designation");
    			attr_dev(input1, "placeholder", "Your Designation");
    			attr_dev(input1, "class", "svelte-dw8ht");
    			add_location(input1, file, 421, 2, 7622);
    			attr_dev(div1, "class", "form-group svelte-dw8ht");
    			add_location(div1, file, 419, 3, 7545);
    			attr_dev(label2, "for", "address");
    			attr_dev(label2, "class", "svelte-dw8ht");
    			add_location(label2, file, 424, 2, 7769);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "address");
    			attr_dev(input2, "placeholder", "Your Address");
    			attr_dev(input2, "class", "svelte-dw8ht");
    			add_location(input2, file, 425, 2, 7810);
    			attr_dev(div2, "class", "form-group svelte-dw8ht");
    			add_location(div2, file, 423, 3, 7741);
    			attr_dev(label3, "for", "phoneNumber");
    			attr_dev(label3, "class", "svelte-dw8ht");
    			add_location(label3, file, 428, 2, 7945);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "id", "phoneNumber");
    			attr_dev(input3, "placeholder", "Your Phone Number with Country Code");
    			attr_dev(input3, "class", "svelte-dw8ht");
    			add_location(input3, file, 429, 2, 7995);
    			attr_dev(div3, "class", "form-group svelte-dw8ht");
    			add_location(div3, file, 427, 3, 7917);
    			attr_dev(label4, "for", "website");
    			attr_dev(label4, "class", "svelte-dw8ht");
    			add_location(label4, file, 432, 2, 8161);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "website");
    			attr_dev(input4, "placeholder", "Your Website");
    			attr_dev(input4, "class", "svelte-dw8ht");
    			add_location(input4, file, 433, 2, 8202);
    			attr_dev(div4, "class", "form-group svelte-dw8ht");
    			add_location(div4, file, 431, 3, 8133);
    			attr_dev(button, "class", "svelte-dw8ht");
    			add_location(button, file, 436, 2, 8341);
    			attr_dev(div5, "class", "button-section svelte-dw8ht");
    			add_location(div5, file, 435, 3, 8309);
    			attr_dev(div6, "class", "input-section svelte-dw8ht");
    			add_location(div6, file, 413, 1, 7319);
    			attr_dev(h31, "class", "svelte-dw8ht");
    			add_location(h31, file, 441, 2, 8446);
    			attr_dev(img0, "class", "icon svelte-dw8ht");
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\a.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 445, 4, 8586);
    			attr_dev(section0, "class", "frame svelte-dw8ht");
    			add_location(section0, file, 444, 5, 8557);
    			attr_dev(img1, "class", "icon1 svelte-dw8ht");
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\b.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 450, 5, 8808);
    			attr_dev(div7, "class", "frame3 svelte-dw8ht");
    			add_location(div7, file, 449, 6, 8781);
    			attr_dev(p0, "class", "fauget svelte-dw8ht");
    			add_location(p0, file, 454, 7, 9026);
    			attr_dev(p1, "class", "real-estate svelte-dw8ht");
    			add_location(p1, file, 455, 7, 9072);
    			attr_dev(div8, "class", "fauget-real-estate-container svelte-dw8ht");
    			add_location(div8, file, 453, 5, 8975);
    			attr_dev(div9, "class", "frame4 svelte-dw8ht");
    			add_location(div9, file, 452, 6, 8948);
    			attr_dev(div10, "class", "frame2 svelte-dw8ht");
    			add_location(div10, file, 448, 4, 8753);
    			attr_dev(div11, "class", "frame1 svelte-dw8ht");
    			add_location(div11, file, 447, 5, 8727);
    			attr_dev(div12, "class", "front17 svelte-dw8ht");
    			attr_dev(div12, "id", "frontContainer");
    			add_location(div12, file, 443, 4, 8509);
    			attr_dev(div13, "class", "business-card-front svelte-dw8ht");
    			add_location(div13, file, 442, 2, 8470);
    			attr_dev(h32, "class", "svelte-dw8ht");
    			add_location(h32, file, 463, 2, 9202);
    			attr_dev(p2, "class", "john-leopard svelte-dw8ht");
    			add_location(p2, file, 469, 5, 9447);
    			attr_dev(p3, "class", "real-estate-agent svelte-dw8ht");
    			add_location(p3, file, 470, 5, 9497);
    			attr_dev(div14, "class", "john-leopard-real-container svelte-dw8ht");
    			add_location(div14, file, 468, 6, 9399);
    			attr_dev(img2, "class", "frame-icon svelte-dw8ht");
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\a.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 472, 6, 9574);
    			attr_dev(div15, "class", "john-leopard-real-estate-agent-parent svelte-dw8ht");
    			add_location(div15, file, 467, 4, 9340);
    			attr_dev(img3, "class", "icon2 svelte-dw8ht");
    			attr_dev(img3, "alt", "");
    			if (!src_url_equal(img3.src, img3_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\left.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 474, 4, 9715);
    			attr_dev(div16, "class", "frame-child svelte-dw8ht");
    			add_location(div16, file, 477, 4, 9854);
    			attr_dev(div17, "class", "div svelte-dw8ht");
    			add_location(div17, file, 479, 6, 9919);
    			attr_dev(div18, "class", "div svelte-dw8ht");
    			add_location(div18, file, 480, 6, 9972);
    			attr_dev(div19, "class", "div svelte-dw8ht");
    			add_location(div19, file, 481, 6, 10021);
    			attr_dev(div20, "class", "frame6 svelte-dw8ht");
    			add_location(div20, file, 478, 4, 9891);
    			attr_dev(img4, "class", "frame-icon1 svelte-dw8ht");
    			attr_dev(img4, "alt", "");
    			if (!src_url_equal(img4.src, img4_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\zero.png")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file, 484, 6, 10108);
    			attr_dev(img5, "class", "frame-icon2 svelte-dw8ht");
    			attr_dev(img5, "alt", "");
    			if (!src_url_equal(img5.src, img5_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\first.png")) attr_dev(img5, "src", img5_src_value);
    			add_location(img5, file, 487, 6, 10255);
    			attr_dev(img6, "class", "frame-icon3 svelte-dw8ht");
    			attr_dev(img6, "alt", "");
    			if (!src_url_equal(img6.src, img6_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\second.png")) attr_dev(img6, "src", img6_src_value);
    			add_location(img6, file, 490, 6, 10403);
    			attr_dev(div21, "class", "frame7 svelte-dw8ht");
    			add_location(div21, file, 483, 4, 10080);
    			attr_dev(section1, "class", "frame5 svelte-dw8ht");
    			add_location(section1, file, 466, 5, 9310);
    			attr_dev(div22, "class", "back svelte-dw8ht");
    			attr_dev(div22, "id", "backContainer");
    			add_location(div22, file, 465, 4, 9266);
    			attr_dev(div23, "class", "business-card-back svelte-dw8ht");
    			add_location(div23, file, 464, 2, 9228);
    			attr_dev(div24, "class", "preview-section svelte-dw8ht");
    			add_location(div24, file, 440, 1, 8413);
    			attr_dev(div25, "class", "business-card-container svelte-dw8ht");
    			add_location(div25, file, 412, 2, 7279);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div25, anchor);
    			append_dev(div25, div6);
    			append_dev(div6, h30);
    			append_dev(div6, t1);
    			append_dev(div6, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			set_input_value(input0, /*formData*/ ctx[0].name);
    			append_dev(div6, t4);
    			append_dev(div6, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			set_input_value(input1, /*formData*/ ctx[0].designation);
    			append_dev(div6, t7);
    			append_dev(div6, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t9);
    			append_dev(div2, input2);
    			set_input_value(input2, /*formData*/ ctx[0].address);
    			append_dev(div6, t10);
    			append_dev(div6, div3);
    			append_dev(div3, label3);
    			append_dev(div3, t12);
    			append_dev(div3, input3);
    			set_input_value(input3, /*formData*/ ctx[0].phoneNumber);
    			append_dev(div6, t13);
    			append_dev(div6, div4);
    			append_dev(div4, label4);
    			append_dev(div4, t15);
    			append_dev(div4, input4);
    			set_input_value(input4, /*formData*/ ctx[0].website);
    			append_dev(div6, t16);
    			append_dev(div6, div5);
    			append_dev(div5, button);
    			append_dev(div25, t18);
    			append_dev(div25, div24);
    			append_dev(div24, h31);
    			append_dev(div24, t20);
    			append_dev(div24, div13);
    			append_dev(div13, div12);
    			append_dev(div12, section0);
    			append_dev(section0, img0);
    			append_dev(div12, t21);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div7);
    			append_dev(div7, img1);
    			append_dev(div10, t22);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, p0);
    			append_dev(p0, t23);
    			append_dev(div8, t24);
    			append_dev(div8, p1);
    			append_dev(p1, t25);
    			append_dev(div24, t26);
    			append_dev(div24, h32);
    			append_dev(div24, t28);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, section1);
    			append_dev(section1, div15);
    			append_dev(div15, div14);
    			append_dev(div14, p2);
    			append_dev(p2, t29);
    			append_dev(div14, t30);
    			append_dev(div14, p3);
    			append_dev(p3, t31);
    			append_dev(div15, t32);
    			append_dev(div15, img2);
    			append_dev(section1, t33);
    			append_dev(section1, img3);
    			append_dev(section1, t34);
    			append_dev(section1, div16);
    			append_dev(section1, t35);
    			append_dev(section1, div20);
    			append_dev(div20, div17);
    			append_dev(div17, t36);
    			append_dev(div20, t37);
    			append_dev(div20, div18);
    			append_dev(div18, t38);
    			append_dev(div20, t39);
    			append_dev(div20, div19);
    			append_dev(div19, t40);
    			append_dev(section1, t41);
    			append_dev(section1, div21);
    			append_dev(div21, img4);
    			append_dev(div21, t42);
    			append_dev(div21, img5);
    			append_dev(div21, t43);
    			append_dev(div21, img6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[7]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[8]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[9]),
    					listen_dev(button, "click", /*submitForm*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formData*/ 1 && input0.value !== /*formData*/ ctx[0].name) {
    				set_input_value(input0, /*formData*/ ctx[0].name);
    			}

    			if (dirty & /*formData*/ 1 && input1.value !== /*formData*/ ctx[0].designation) {
    				set_input_value(input1, /*formData*/ ctx[0].designation);
    			}

    			if (dirty & /*formData*/ 1 && input2.value !== /*formData*/ ctx[0].address) {
    				set_input_value(input2, /*formData*/ ctx[0].address);
    			}

    			if (dirty & /*formData*/ 1 && input3.value !== /*formData*/ ctx[0].phoneNumber) {
    				set_input_value(input3, /*formData*/ ctx[0].phoneNumber);
    			}

    			if (dirty & /*formData*/ 1 && input4.value !== /*formData*/ ctx[0].website) {
    				set_input_value(input4, /*formData*/ ctx[0].website);
    			}

    			if (dirty & /*formData*/ 1 && t23_value !== (t23_value = /*formData*/ ctx[0].name + "")) set_data_dev(t23, t23_value);
    			if (dirty & /*formData*/ 1 && t25_value !== (t25_value = /*formData*/ ctx[0].website + "")) set_data_dev(t25, t25_value);
    			if (dirty & /*formData*/ 1 && t29_value !== (t29_value = /*formData*/ ctx[0].name + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*formData*/ 1 && t31_value !== (t31_value = /*formData*/ ctx[0].designation + "")) set_data_dev(t31, t31_value);
    			if (dirty & /*formData*/ 1 && t36_value !== (t36_value = /*formData*/ ctx[0].phoneNumber + "")) set_data_dev(t36, t36_value);
    			if (dirty & /*formData*/ 1 && t38_value !== (t38_value = /*formData*/ ctx[0].website + "")) set_data_dev(t38, t38_value);
    			if (dirty & /*formData*/ 1 && t40_value !== (t40_value = /*formData*/ ctx[0].address + "")) set_data_dev(t40, t40_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div25);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(412:2) {#if currentPage === \\\"home\\\"}",
    		ctx
    	});

    	return block;
    }

    // (500:2) {#if showPrompt}
    function create_if_block(ctx) {
    	let div18;
    	let div17;
    	let p0;
    	let t1;
    	let h30;
    	let t3;
    	let div6;
    	let div5;
    	let section0;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div4;
    	let div3;
    	let div0;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div2;
    	let div1;
    	let p1;
    	let t6_value = /*formData*/ ctx[0].name + "";
    	let t6;
    	let t7;
    	let p2;
    	let t8_value = /*formData*/ ctx[0].website + "";
    	let t8;
    	let t9;
    	let h31;
    	let t11;
    	let div16;
    	let div15;
    	let section1;
    	let div8;
    	let div7;
    	let p3;
    	let t12_value = /*formData*/ ctx[0].name + "";
    	let t12;
    	let t13;
    	let p4;
    	let t14_value = /*formData*/ ctx[0].designation + "";
    	let t14;
    	let t15;
    	let img2;
    	let img2_src_value;
    	let t16;
    	let img3;
    	let img3_src_value;
    	let t17;
    	let div9;
    	let t18;
    	let div13;
    	let div10;
    	let t19_value = /*formData*/ ctx[0].phoneNumber + "";
    	let t19;
    	let t20;
    	let div11;
    	let t21_value = /*formData*/ ctx[0].website + "";
    	let t21;
    	let t22;
    	let div12;
    	let t23_value = /*formData*/ ctx[0].address + "";
    	let t23;
    	let t24;
    	let div14;
    	let img4;
    	let img4_src_value;
    	let t25;
    	let img5;
    	let img5_src_value;
    	let t26;
    	let img6;
    	let img6_src_value;
    	let t27;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div18 = element("div");
    			div17 = element("div");
    			p0 = element("p");
    			p0.textContent = "Form Submitted!";
    			t1 = space();
    			h30 = element("h3");
    			h30.textContent = "Front Side:";
    			t3 = space();
    			div6 = element("div");
    			div5 = element("div");
    			section0 = element("section");
    			img0 = element("img");
    			t4 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			img1 = element("img");
    			t5 = space();
    			div2 = element("div");
    			div1 = element("div");
    			p1 = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			p2 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			h31 = element("h3");
    			h31.textContent = "Reverse Side:";
    			t11 = space();
    			div16 = element("div");
    			div15 = element("div");
    			section1 = element("section");
    			div8 = element("div");
    			div7 = element("div");
    			p3 = element("p");
    			t12 = text(t12_value);
    			t13 = space();
    			p4 = element("p");
    			t14 = text(t14_value);
    			t15 = space();
    			img2 = element("img");
    			t16 = space();
    			img3 = element("img");
    			t17 = space();
    			div9 = element("div");
    			t18 = space();
    			div13 = element("div");
    			div10 = element("div");
    			t19 = text(t19_value);
    			t20 = space();
    			div11 = element("div");
    			t21 = text(t21_value);
    			t22 = space();
    			div12 = element("div");
    			t23 = text(t23_value);
    			t24 = space();
    			div14 = element("div");
    			img4 = element("img");
    			t25 = space();
    			img5 = element("img");
    			t26 = space();
    			img6 = element("img");
    			t27 = space();
    			button = element("button");
    			button.textContent = "Close";
    			add_location(p0, file, 502, 3, 10694);
    			add_location(h30, file, 503, 3, 10721);
    			attr_dev(img0, "class", "icon svelte-dw8ht");
    			attr_dev(img0, "alt", "");
    			if (!src_url_equal(img0.src, img0_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\a.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 507, 4, 10861);
    			attr_dev(section0, "class", "frame svelte-dw8ht");
    			add_location(section0, file, 506, 5, 10832);
    			attr_dev(img1, "class", "icon1 svelte-dw8ht");
    			attr_dev(img1, "alt", "");
    			if (!src_url_equal(img1.src, img1_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\b.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 512, 5, 11083);
    			attr_dev(div0, "class", "frame3 svelte-dw8ht");
    			add_location(div0, file, 511, 6, 11056);
    			attr_dev(p1, "class", "fauget svelte-dw8ht");
    			add_location(p1, file, 516, 7, 11301);
    			attr_dev(p2, "class", "real-estate svelte-dw8ht");
    			add_location(p2, file, 517, 7, 11347);
    			attr_dev(div1, "class", "fauget-real-estate-container svelte-dw8ht");
    			add_location(div1, file, 515, 5, 11250);
    			attr_dev(div2, "class", "frame4 svelte-dw8ht");
    			add_location(div2, file, 514, 6, 11223);
    			attr_dev(div3, "class", "frame2 svelte-dw8ht");
    			add_location(div3, file, 510, 4, 11028);
    			attr_dev(div4, "class", "frame1 svelte-dw8ht");
    			add_location(div4, file, 509, 5, 11002);
    			attr_dev(div5, "class", "front17 svelte-dw8ht");
    			attr_dev(div5, "id", "frontContainer");
    			add_location(div5, file, 505, 4, 10784);
    			attr_dev(div6, "class", "business-card-front svelte-dw8ht");
    			add_location(div6, file, 504, 2, 10745);
    			add_location(h31, file, 525, 2, 11477);
    			attr_dev(p3, "class", "john-leopard svelte-dw8ht");
    			add_location(p3, file, 531, 5, 11722);
    			attr_dev(p4, "class", "real-estate-agent svelte-dw8ht");
    			add_location(p4, file, 532, 5, 11772);
    			attr_dev(div7, "class", "john-leopard-real-container svelte-dw8ht");
    			add_location(div7, file, 530, 6, 11674);
    			attr_dev(img2, "class", "frame-icon svelte-dw8ht");
    			attr_dev(img2, "alt", "");
    			if (!src_url_equal(img2.src, img2_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\a.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 534, 6, 11849);
    			attr_dev(div8, "class", "john-leopard-real-estate-agent-parent svelte-dw8ht");
    			add_location(div8, file, 529, 4, 11615);
    			attr_dev(img3, "class", "icon2 svelte-dw8ht");
    			attr_dev(img3, "alt", "");
    			if (!src_url_equal(img3.src, img3_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\left.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 536, 4, 11990);
    			attr_dev(div9, "class", "frame-child svelte-dw8ht");
    			add_location(div9, file, 539, 4, 12129);
    			attr_dev(div10, "class", "div svelte-dw8ht");
    			add_location(div10, file, 541, 6, 12194);
    			attr_dev(div11, "class", "div svelte-dw8ht");
    			add_location(div11, file, 542, 6, 12247);
    			attr_dev(div12, "class", "div svelte-dw8ht");
    			add_location(div12, file, 543, 6, 12296);
    			attr_dev(div13, "class", "frame6 svelte-dw8ht");
    			add_location(div13, file, 540, 4, 12166);
    			attr_dev(img4, "class", "frame-icon1 svelte-dw8ht");
    			attr_dev(img4, "alt", "");
    			if (!src_url_equal(img4.src, img4_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\zero.png")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file, 546, 6, 12383);
    			attr_dev(img5, "class", "frame-icon2 svelte-dw8ht");
    			attr_dev(img5, "alt", "");
    			if (!src_url_equal(img5.src, img5_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\first.png")) attr_dev(img5, "src", img5_src_value);
    			add_location(img5, file, 549, 6, 12530);
    			attr_dev(img6, "class", "frame-icon3 svelte-dw8ht");
    			attr_dev(img6, "alt", "");
    			if (!src_url_equal(img6.src, img6_src_value = "C:\\Users\\Sayalee\\Downloads\\GIt-Hub\\svelte-app\\module-4\\template-card17\\public\\second.png")) attr_dev(img6, "src", img6_src_value);
    			add_location(img6, file, 552, 6, 12678);
    			attr_dev(div14, "class", "frame7 svelte-dw8ht");
    			add_location(div14, file, 545, 4, 12355);
    			attr_dev(section1, "class", "frame5 svelte-dw8ht");
    			add_location(section1, file, 528, 5, 11585);
    			attr_dev(div15, "class", "back svelte-dw8ht");
    			attr_dev(div15, "id", "backContainer");
    			add_location(div15, file, 527, 4, 11541);
    			attr_dev(div16, "class", "business-card-back svelte-dw8ht");
    			add_location(div16, file, 526, 2, 11503);
    			add_location(button, file, 557, 3, 12862);
    			attr_dev(div17, "class", "prompt-content svelte-dw8ht");
    			add_location(div17, file, 501, 1, 10661);
    			attr_dev(div18, "class", "prompt svelte-dw8ht");
    			add_location(div18, file, 500, 2, 10638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div18, anchor);
    			append_dev(div18, div17);
    			append_dev(div17, p0);
    			append_dev(div17, t1);
    			append_dev(div17, h30);
    			append_dev(div17, t3);
    			append_dev(div17, div6);
    			append_dev(div6, div5);
    			append_dev(div5, section0);
    			append_dev(section0, img0);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img1);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p2);
    			append_dev(p2, t8);
    			append_dev(div17, t9);
    			append_dev(div17, h31);
    			append_dev(div17, t11);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, section1);
    			append_dev(section1, div8);
    			append_dev(div8, div7);
    			append_dev(div7, p3);
    			append_dev(p3, t12);
    			append_dev(div7, t13);
    			append_dev(div7, p4);
    			append_dev(p4, t14);
    			append_dev(div8, t15);
    			append_dev(div8, img2);
    			append_dev(section1, t16);
    			append_dev(section1, img3);
    			append_dev(section1, t17);
    			append_dev(section1, div9);
    			append_dev(section1, t18);
    			append_dev(section1, div13);
    			append_dev(div13, div10);
    			append_dev(div10, t19);
    			append_dev(div13, t20);
    			append_dev(div13, div11);
    			append_dev(div11, t21);
    			append_dev(div13, t22);
    			append_dev(div13, div12);
    			append_dev(div12, t23);
    			append_dev(section1, t24);
    			append_dev(section1, div14);
    			append_dev(div14, img4);
    			append_dev(div14, t25);
    			append_dev(div14, img5);
    			append_dev(div14, t26);
    			append_dev(div14, img6);
    			append_dev(div17, t27);
    			append_dev(div17, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*closePrompt*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formData*/ 1 && t6_value !== (t6_value = /*formData*/ ctx[0].name + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*formData*/ 1 && t8_value !== (t8_value = /*formData*/ ctx[0].website + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*formData*/ 1 && t12_value !== (t12_value = /*formData*/ ctx[0].name + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*formData*/ 1 && t14_value !== (t14_value = /*formData*/ ctx[0].designation + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*formData*/ 1 && t19_value !== (t19_value = /*formData*/ ctx[0].phoneNumber + "")) set_data_dev(t19, t19_value);
    			if (dirty & /*formData*/ 1 && t21_value !== (t21_value = /*formData*/ ctx[0].website + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*formData*/ 1 && t23_value !== (t23_value = /*formData*/ ctx[0].address + "")) set_data_dev(t23, t23_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div18);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(500:2) {#if showPrompt}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let t2;
    	let if_block1_anchor;
    	let if_block0 = /*currentPage*/ ctx[2] === "home" && create_if_block_1(ctx);
    	let if_block1 = /*showPrompt*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			t0 = space();
    			link1 = element("link");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "href", "https://fonts.googleapis.com/css2?family=Playfair Display:wght@400;600&display=swap");
    			add_location(link0, file, 407, 2, 7005);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css2?family=DM Serif Display:wght@400&display=swap");
    			add_location(link1, file, 408, 2, 7125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, link1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
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
    					if_block0.m(t2.parentNode, t2);
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
    			if (detaching) detach_dev(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(link1);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
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
    		name: "Name",
    		designation: "Prof",
    		address: "Address",
    		phoneNumber: "PhoneNumber",
    		website: "Website"
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
    		formData.designation = this.value;
    		$$invalidate(0, formData);
    	}

    	function input2_input_handler() {
    		formData.address = this.value;
    		$$invalidate(0, formData);
    	}

    	function input3_input_handler() {
    		formData.phoneNumber = this.value;
    		$$invalidate(0, formData);
    	}

    	function input4_input_handler() {
    		formData.website = this.value;
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
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler
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
