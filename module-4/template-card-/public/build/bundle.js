
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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

    // (144:2) {#if currentPage === "home"}
    function create_if_block_1(ctx) {
    	let div17;
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
    	let div16;
    	let h31;
    	let t20;
    	let div9;
    	let div7;
    	let t21_value = /*formData*/ ctx[0].name + "";
    	let t21;
    	let t22;
    	let div8;
    	let t23_value = /*formData*/ ctx[0].website + "";
    	let t23;
    	let t24;
    	let h32;
    	let t26;
    	let div15;
    	let div10;
    	let t27_value = /*formData*/ ctx[0].name + "";
    	let t27;
    	let t28;
    	let div11;
    	let t29_value = /*formData*/ ctx[0].designation + "";
    	let t29;
    	let t30;
    	let div12;
    	let t31_value = /*formData*/ ctx[0].address + "";
    	let t31;
    	let t32;
    	let div13;
    	let t33_value = /*formData*/ ctx[0].phoneNumber + "";
    	let t33;
    	let t34;
    	let div14;
    	let t35_value = /*formData*/ ctx[0].website + "";
    	let t35;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div17 = element("div");
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
    			div16 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Front Side:";
    			t20 = space();
    			div9 = element("div");
    			div7 = element("div");
    			t21 = text(t21_value);
    			t22 = space();
    			div8 = element("div");
    			t23 = text(t23_value);
    			t24 = space();
    			h32 = element("h3");
    			h32.textContent = "Reverse Side:";
    			t26 = space();
    			div15 = element("div");
    			div10 = element("div");
    			t27 = text(t27_value);
    			t28 = space();
    			div11 = element("div");
    			t29 = text(t29_value);
    			t30 = space();
    			div12 = element("div");
    			t31 = text(t31_value);
    			t32 = space();
    			div13 = element("div");
    			t33 = text(t33_value);
    			t34 = space();
    			div14 = element("div");
    			t35 = text(t35_value);
    			attr_dev(h30, "class", "svelte-nf05gt");
    			add_location(h30, file, 146, 3, 2871);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-nf05gt");
    			add_location(label0, file, 148, 2, 2932);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "placeholder", "Your Name");
    			attr_dev(input0, "class", "svelte-nf05gt");
    			add_location(input0, file, 149, 2, 2967);
    			attr_dev(div0, "class", "form-group svelte-nf05gt");
    			add_location(div0, file, 147, 3, 2904);
    			attr_dev(label1, "for", "designation");
    			attr_dev(label1, "class", "svelte-nf05gt");
    			add_location(label1, file, 152, 2, 3093);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "designation");
    			attr_dev(input1, "placeholder", "Your Designation");
    			attr_dev(input1, "class", "svelte-nf05gt");
    			add_location(input1, file, 153, 2, 3142);
    			attr_dev(div1, "class", "form-group svelte-nf05gt");
    			add_location(div1, file, 151, 3, 3065);
    			attr_dev(label2, "for", "address");
    			attr_dev(label2, "class", "svelte-nf05gt");
    			add_location(label2, file, 156, 2, 3289);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "address");
    			attr_dev(input2, "placeholder", "Your Address");
    			attr_dev(input2, "class", "svelte-nf05gt");
    			add_location(input2, file, 157, 2, 3330);
    			attr_dev(div2, "class", "form-group svelte-nf05gt");
    			add_location(div2, file, 155, 3, 3261);
    			attr_dev(label3, "for", "phoneNumber");
    			attr_dev(label3, "class", "svelte-nf05gt");
    			add_location(label3, file, 160, 2, 3465);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "id", "phoneNumber");
    			attr_dev(input3, "placeholder", "Your Phone Number with Country Code");
    			attr_dev(input3, "class", "svelte-nf05gt");
    			add_location(input3, file, 161, 2, 3515);
    			attr_dev(div3, "class", "form-group svelte-nf05gt");
    			add_location(div3, file, 159, 3, 3437);
    			attr_dev(label4, "for", "website");
    			attr_dev(label4, "class", "svelte-nf05gt");
    			add_location(label4, file, 164, 2, 3681);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "website");
    			attr_dev(input4, "placeholder", "Your Website");
    			attr_dev(input4, "class", "svelte-nf05gt");
    			add_location(input4, file, 165, 2, 3722);
    			attr_dev(div4, "class", "form-group svelte-nf05gt");
    			add_location(div4, file, 163, 3, 3653);
    			attr_dev(button, "class", "svelte-nf05gt");
    			add_location(button, file, 168, 2, 3861);
    			attr_dev(div5, "class", "button-section svelte-nf05gt");
    			add_location(div5, file, 167, 3, 3829);
    			attr_dev(div6, "class", "input-section svelte-nf05gt");
    			add_location(div6, file, 145, 1, 2839);
    			attr_dev(h31, "class", "svelte-nf05gt");
    			add_location(h31, file, 173, 3, 3967);
    			attr_dev(div7, "class", "business-card-text svelte-nf05gt");
    			add_location(div7, file, 175, 2, 4029);
    			attr_dev(div8, "class", "business-card-text svelte-nf05gt");
    			add_location(div8, file, 176, 2, 4086);
    			attr_dev(div9, "class", "business-card-front svelte-nf05gt");
    			add_location(div9, file, 174, 3, 3992);
    			attr_dev(h32, "class", "svelte-nf05gt");
    			add_location(h32, file, 178, 3, 4158);
    			attr_dev(div10, "class", "business-card-text svelte-nf05gt");
    			add_location(div10, file, 180, 2, 4221);
    			attr_dev(div11, "class", "business-card-text svelte-nf05gt");
    			add_location(div11, file, 181, 2, 4278);
    			attr_dev(div12, "class", "business-card-text svelte-nf05gt");
    			add_location(div12, file, 182, 2, 4342);
    			attr_dev(div13, "class", "business-card-text svelte-nf05gt");
    			add_location(div13, file, 183, 2, 4402);
    			attr_dev(div14, "class", "business-card-text svelte-nf05gt");
    			add_location(div14, file, 184, 2, 4466);
    			attr_dev(div15, "class", "business-card-back svelte-nf05gt");
    			add_location(div15, file, 179, 3, 4185);
    			attr_dev(div16, "class", "preview-section svelte-nf05gt");
    			add_location(div16, file, 172, 1, 3933);
    			attr_dev(div17, "class", "business-card-container svelte-nf05gt");
    			add_location(div17, file, 144, 2, 2799);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div6);
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
    			append_dev(div17, t18);
    			append_dev(div17, div16);
    			append_dev(div16, h31);
    			append_dev(div16, t20);
    			append_dev(div16, div9);
    			append_dev(div9, div7);
    			append_dev(div7, t21);
    			append_dev(div9, t22);
    			append_dev(div9, div8);
    			append_dev(div8, t23);
    			append_dev(div16, t24);
    			append_dev(div16, h32);
    			append_dev(div16, t26);
    			append_dev(div16, div15);
    			append_dev(div15, div10);
    			append_dev(div10, t27);
    			append_dev(div15, t28);
    			append_dev(div15, div11);
    			append_dev(div11, t29);
    			append_dev(div15, t30);
    			append_dev(div15, div12);
    			append_dev(div12, t31);
    			append_dev(div15, t32);
    			append_dev(div15, div13);
    			append_dev(div13, t33);
    			append_dev(div15, t34);
    			append_dev(div15, div14);
    			append_dev(div14, t35);

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

    			if (dirty & /*formData*/ 1 && t21_value !== (t21_value = /*formData*/ ctx[0].name + "")) set_data_dev(t21, t21_value);
    			if (dirty & /*formData*/ 1 && t23_value !== (t23_value = /*formData*/ ctx[0].website + "")) set_data_dev(t23, t23_value);
    			if (dirty & /*formData*/ 1 && t27_value !== (t27_value = /*formData*/ ctx[0].name + "")) set_data_dev(t27, t27_value);
    			if (dirty & /*formData*/ 1 && t29_value !== (t29_value = /*formData*/ ctx[0].designation + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*formData*/ 1 && t31_value !== (t31_value = /*formData*/ ctx[0].address + "")) set_data_dev(t31, t31_value);
    			if (dirty & /*formData*/ 1 && t33_value !== (t33_value = /*formData*/ ctx[0].phoneNumber + "")) set_data_dev(t33, t33_value);
    			if (dirty & /*formData*/ 1 && t35_value !== (t35_value = /*formData*/ ctx[0].website + "")) set_data_dev(t35, t35_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div17);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(144:2) {#if currentPage === \\\"home\\\"}",
    		ctx
    	});

    	return block;
    }

    // (191:2) {#if showPrompt}
    function create_if_block(ctx) {
    	let div10;
    	let div9;
    	let p;
    	let t1;
    	let h30;
    	let t3;
    	let div2;
    	let div0;
    	let t4_value = /*formData*/ ctx[0].name + "";
    	let t4;
    	let t5;
    	let div1;
    	let t6_value = /*formData*/ ctx[0].website + "";
    	let t6;
    	let t7;
    	let h31;
    	let t9;
    	let div8;
    	let div3;
    	let t10_value = /*formData*/ ctx[0].name + "";
    	let t10;
    	let t11;
    	let div4;
    	let t12_value = /*formData*/ ctx[0].designation + "";
    	let t12;
    	let t13;
    	let div5;
    	let t14_value = /*formData*/ ctx[0].address + "";
    	let t14;
    	let t15;
    	let div6;
    	let t16_value = /*formData*/ ctx[0].phoneNumber + "";
    	let t16;
    	let t17;
    	let div7;
    	let t18_value = /*formData*/ ctx[0].website + "";
    	let t18;
    	let t19;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			p = element("p");
    			p.textContent = "Form Submitted!";
    			t1 = space();
    			h30 = element("h3");
    			h30.textContent = "Front Side:";
    			t3 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "Reverse Side:";
    			t9 = space();
    			div8 = element("div");
    			div3 = element("div");
    			t10 = text(t10_value);
    			t11 = space();
    			div4 = element("div");
    			t12 = text(t12_value);
    			t13 = space();
    			div5 = element("div");
    			t14 = text(t14_value);
    			t15 = space();
    			div6 = element("div");
    			t16 = text(t16_value);
    			t17 = space();
    			div7 = element("div");
    			t18 = text(t18_value);
    			t19 = space();
    			button = element("button");
    			button.textContent = "Close";
    			add_location(p, file, 193, 3, 4645);
    			add_location(h30, file, 194, 3, 4672);
    			attr_dev(div0, "class", "business-card-text svelte-nf05gt");
    			add_location(div0, file, 196, 2, 4734);
    			attr_dev(div1, "class", "business-card-text svelte-nf05gt");
    			add_location(div1, file, 197, 2, 4791);
    			attr_dev(div2, "class", "business-card-front svelte-nf05gt");
    			add_location(div2, file, 195, 3, 4697);
    			add_location(h31, file, 199, 3, 4863);
    			attr_dev(div3, "class", "business-card-text svelte-nf05gt");
    			add_location(div3, file, 201, 2, 4926);
    			attr_dev(div4, "class", "business-card-text svelte-nf05gt");
    			add_location(div4, file, 202, 2, 4983);
    			attr_dev(div5, "class", "business-card-text svelte-nf05gt");
    			add_location(div5, file, 203, 2, 5047);
    			attr_dev(div6, "class", "business-card-text svelte-nf05gt");
    			add_location(div6, file, 204, 2, 5107);
    			attr_dev(div7, "class", "business-card-text svelte-nf05gt");
    			add_location(div7, file, 205, 2, 5171);
    			attr_dev(div8, "class", "business-card-back svelte-nf05gt");
    			add_location(div8, file, 200, 3, 4890);
    			add_location(button, file, 207, 3, 5243);
    			attr_dev(div9, "class", "prompt-content svelte-nf05gt");
    			add_location(div9, file, 192, 1, 4612);
    			attr_dev(div10, "class", "prompt svelte-nf05gt");
    			add_location(div10, file, 191, 2, 4589);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, p);
    			append_dev(div9, t1);
    			append_dev(div9, h30);
    			append_dev(div9, t3);
    			append_dev(div9, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, t6);
    			append_dev(div9, t7);
    			append_dev(div9, h31);
    			append_dev(div9, t9);
    			append_dev(div9, div8);
    			append_dev(div8, div3);
    			append_dev(div3, t10);
    			append_dev(div8, t11);
    			append_dev(div8, div4);
    			append_dev(div4, t12);
    			append_dev(div8, t13);
    			append_dev(div8, div5);
    			append_dev(div5, t14);
    			append_dev(div8, t15);
    			append_dev(div8, div6);
    			append_dev(div6, t16);
    			append_dev(div8, t17);
    			append_dev(div8, div7);
    			append_dev(div7, t18);
    			append_dev(div9, t19);
    			append_dev(div9, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*closePrompt*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formData*/ 1 && t4_value !== (t4_value = /*formData*/ ctx[0].name + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*formData*/ 1 && t6_value !== (t6_value = /*formData*/ ctx[0].website + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*formData*/ 1 && t10_value !== (t10_value = /*formData*/ ctx[0].name + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*formData*/ 1 && t12_value !== (t12_value = /*formData*/ ctx[0].designation + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*formData*/ 1 && t14_value !== (t14_value = /*formData*/ ctx[0].address + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*formData*/ 1 && t16_value !== (t16_value = /*formData*/ ctx[0].phoneNumber + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*formData*/ 1 && t18_value !== (t18_value = /*formData*/ ctx[0].website + "")) set_data_dev(t18, t18_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(191:2) {#if showPrompt}",
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
