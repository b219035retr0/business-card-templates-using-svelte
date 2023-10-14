
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let link;
    	let t0;
    	let div0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let button3;
    	let t8;
    	let button4;
    	let t10;
    	let div3;
    	let div1;
    	let t12;
    	let form;
    	let label0;
    	let t14;
    	let input0;
    	let t15;
    	let label1;
    	let t17;
    	let input1;
    	let t18;
    	let label2;
    	let t20;
    	let input2;
    	let t21;
    	let label3;
    	let t23;
    	let div2;
    	let input3;
    	let t24;
    	let input4;
    	let t25;
    	let label4;
    	let t27;
    	let input5;
    	let t28;
    	let label5;
    	let t30;
    	let input6;
    	let t31;
    	let label6;
    	let t33;
    	let textarea;
    	let t34;
    	let button5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Home";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "About";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "Templates";
    			t6 = space();
    			button3 = element("button");
    			button3.textContent = "Support";
    			t8 = space();
    			button4 = element("button");
    			button4.textContent = "Login/Signup";
    			t10 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "The Business Card Generator: Input Form";
    			t12 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t14 = space();
    			input0 = element("input");
    			t15 = space();
    			label1 = element("label");
    			label1.textContent = "Title";
    			t17 = space();
    			input1 = element("input");
    			t18 = space();
    			label2 = element("label");
    			label2.textContent = "Company";
    			t20 = space();
    			input2 = element("input");
    			t21 = space();
    			label3 = element("label");
    			label3.textContent = "Phone Number";
    			t23 = space();
    			div2 = element("div");
    			input3 = element("input");
    			t24 = space();
    			input4 = element("input");
    			t25 = space();
    			label4 = element("label");
    			label4.textContent = "Email";
    			t27 = space();
    			input5 = element("input");
    			t28 = space();
    			label5 = element("label");
    			label5.textContent = "Website";
    			t30 = space();
    			input6 = element("input");
    			t31 = space();
    			label6 = element("label");
    			label6.textContent = "Address";
    			t33 = space();
    			textarea = element("textarea");
    			t34 = space();
    			button5 = element("button");
    			button5.textContent = "Generate Business Card";
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;700&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file, 142, 2, 2958);
    			attr_dev(button0, "class", "svelte-1slqpjg");
    			add_location(button0, file, 146, 1, 3169);
    			attr_dev(button1, "class", "svelte-1slqpjg");
    			add_location(button1, file, 148, 1, 3264);
    			attr_dev(button2, "class", "svelte-1slqpjg");
    			add_location(button2, file, 150, 1, 3361);
    			attr_dev(button3, "class", "svelte-1slqpjg");
    			add_location(button3, file, 152, 1, 3466);
    			attr_dev(button4, "class", "sign-in-button svelte-1slqpjg");
    			add_location(button4, file, 154, 1, 3568);
    			attr_dev(div0, "class", "navbar svelte-1slqpjg");
    			add_location(div0, file, 144, 2, 3101);
    			attr_dev(div1, "class", "title svelte-1slqpjg");
    			add_location(div1, file, 158, 1, 3697);
    			attr_dev(label0, "for", "name");
    			attr_dev(label0, "class", "svelte-1slqpjg");
    			add_location(label0, file, 160, 3, 3800);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-1slqpjg");
    			add_location(input0, file, 161, 3, 3835);
    			attr_dev(label1, "for", "title");
    			attr_dev(label1, "class", "svelte-1slqpjg");
    			add_location(label1, file, 163, 3, 3902);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "title");
    			attr_dev(input1, "class", "svelte-1slqpjg");
    			add_location(input1, file, 164, 3, 3939);
    			attr_dev(label2, "for", "company");
    			attr_dev(label2, "class", "svelte-1slqpjg");
    			add_location(label2, file, 166, 3, 3999);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "company");
    			attr_dev(input2, "class", "svelte-1slqpjg");
    			add_location(input2, file, 167, 3, 4040);
    			attr_dev(label3, "for", "phoneNumber");
    			attr_dev(label3, "class", "svelte-1slqpjg");
    			add_location(label3, file, 169, 3, 4104);
    			attr_dev(input3, "type", "tel");
    			attr_dev(input3, "id", "countryCode");
    			set_style(input3, "width", "20%");
    			set_style(input3, "margin-right", "5px");
    			attr_dev(input3, "placeholder", "Country Code");
    			attr_dev(input3, "class", "svelte-1slqpjg");
    			add_location(input3, file, 171, 2, 4186);
    			attr_dev(input4, "type", "tel");
    			attr_dev(input4, "id", "phoneNumber");
    			set_style(input4, "width", "70%");
    			attr_dev(input4, "placeholder", "Phone Number");
    			input4.required = true;
    			attr_dev(input4, "class", "svelte-1slqpjg");
    			add_location(input4, file, 172, 2, 4318);
    			set_style(div2, "display", "flex");
    			add_location(div2, file, 170, 3, 4154);
    			attr_dev(label4, "for", "email");
    			attr_dev(label4, "class", "svelte-1slqpjg");
    			add_location(label4, file, 175, 3, 4456);
    			attr_dev(input5, "type", "email");
    			attr_dev(input5, "id", "email");
    			input5.required = true;
    			attr_dev(input5, "class", "svelte-1slqpjg");
    			add_location(input5, file, 176, 3, 4493);
    			attr_dev(label5, "for", "website");
    			attr_dev(label5, "class", "svelte-1slqpjg");
    			add_location(label5, file, 178, 3, 4563);
    			attr_dev(input6, "type", "url");
    			attr_dev(input6, "id", "website");
    			attr_dev(input6, "class", "svelte-1slqpjg");
    			add_location(input6, file, 179, 3, 4604);
    			attr_dev(label6, "for", "address");
    			attr_dev(label6, "class", "svelte-1slqpjg");
    			add_location(label6, file, 181, 3, 4667);
    			attr_dev(textarea, "id", "address");
    			textarea.required = true;
    			attr_dev(textarea, "class", "svelte-1slqpjg");
    			add_location(textarea, file, 182, 3, 4708);
    			attr_dev(button5, "type", "submit");
    			attr_dev(button5, "class", "svelte-1slqpjg");
    			add_location(button5, file, 184, 3, 4781);
    			add_location(form, file, 159, 1, 3764);
    			attr_dev(div3, "class", "form-container svelte-1slqpjg");
    			add_location(div3, file, 157, 2, 3666);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, link, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			append_dev(div0, t4);
    			append_dev(div0, button2);
    			append_dev(div0, t6);
    			append_dev(div0, button3);
    			append_dev(div0, t8);
    			append_dev(div0, button4);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div3, t12);
    			append_dev(div3, form);
    			append_dev(form, label0);
    			append_dev(form, t14);
    			append_dev(form, input0);
    			set_input_value(input0, /*name*/ ctx[0]);
    			append_dev(form, t15);
    			append_dev(form, label1);
    			append_dev(form, t17);
    			append_dev(form, input1);
    			set_input_value(input1, /*title*/ ctx[1]);
    			append_dev(form, t18);
    			append_dev(form, label2);
    			append_dev(form, t20);
    			append_dev(form, input2);
    			set_input_value(input2, /*company*/ ctx[2]);
    			append_dev(form, t21);
    			append_dev(form, label3);
    			append_dev(form, t23);
    			append_dev(form, div2);
    			append_dev(div2, input3);
    			set_input_value(input3, /*countryCode*/ ctx[3]);
    			append_dev(div2, t24);
    			append_dev(div2, input4);
    			set_input_value(input4, /*phoneNumber*/ ctx[4]);
    			append_dev(form, t25);
    			append_dev(form, label4);
    			append_dev(form, t27);
    			append_dev(form, input5);
    			set_input_value(input5, /*email*/ ctx[5]);
    			append_dev(form, t28);
    			append_dev(form, label5);
    			append_dev(form, t30);
    			append_dev(form, input6);
    			set_input_value(input6, /*website*/ ctx[7]);
    			append_dev(form, t31);
    			append_dev(form, label6);
    			append_dev(form, t33);
    			append_dev(form, textarea);
    			set_input_value(textarea, /*address*/ ctx[6]);
    			append_dev(form, t34);
    			append_dev(form, button5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", navigateToHome, false, false, false, false),
    					listen_dev(button1, "click", navigateToAbout, false, false, false, false),
    					listen_dev(button2, "click", navigateToTemplates, false, false, false, false),
    					listen_dev(button3, "click", navigateToSupport, false, false, false, false),
    					listen_dev(button4, "click", signInWithGoogle, false, false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[12]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[13]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[14]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[15]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[16]),
    					listen_dev(form, "submit", /*handleSubmit*/ ctx[8], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input0.value !== /*name*/ ctx[0]) {
    				set_input_value(input0, /*name*/ ctx[0]);
    			}

    			if (dirty & /*title*/ 2 && input1.value !== /*title*/ ctx[1]) {
    				set_input_value(input1, /*title*/ ctx[1]);
    			}

    			if (dirty & /*company*/ 4 && input2.value !== /*company*/ ctx[2]) {
    				set_input_value(input2, /*company*/ ctx[2]);
    			}

    			if (dirty & /*countryCode*/ 8) {
    				set_input_value(input3, /*countryCode*/ ctx[3]);
    			}

    			if (dirty & /*phoneNumber*/ 16) {
    				set_input_value(input4, /*phoneNumber*/ ctx[4]);
    			}

    			if (dirty & /*email*/ 32 && input5.value !== /*email*/ ctx[5]) {
    				set_input_value(input5, /*email*/ ctx[5]);
    			}

    			if (dirty & /*website*/ 128 && input6.value !== /*website*/ ctx[7]) {
    				set_input_value(input6, /*website*/ ctx[7]);
    			}

    			if (dirty & /*address*/ 64) {
    				set_input_value(textarea, /*address*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
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
    	let name = '';
    	let title = '';
    	let company = '';
    	let countryCode = '';
    	let phoneNumber = '';
    	let email = '';
    	let address = '';
    	let website = '';

    	// Function to handle Google Sign In
    	function handleSubmit() {
    		if (validateForm()) {
    			alert('Submitted!');
    		} else {
    			alert('Please fill out all required fields correctly.');
    			return;
    		}

    		const formattedPhoneNumber = `${countryCode}-${phoneNumber}`;

    		console.log('Form submitted:', {
    			name,
    			title,
    			company,
    			phoneNumber: formattedPhoneNumber,
    			email,
    			address,
    			website
    		});
    	}

    	function validateForm() {
    		return name.trim() !== '' && email.trim() !== '' && address.trim() !== '' && countryCode.match(/^[\+\d]+$/) && phoneNumber.match(/^[\d]+$/) && phoneNumber.length >= 10 && countryCode.length <= 4;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	function input1_input_handler() {
    		title = this.value;
    		$$invalidate(1, title);
    	}

    	function input2_input_handler() {
    		company = this.value;
    		$$invalidate(2, company);
    	}

    	function input3_input_handler() {
    		countryCode = this.value;
    		$$invalidate(3, countryCode);
    	}

    	function input4_input_handler() {
    		phoneNumber = this.value;
    		$$invalidate(4, phoneNumber);
    	}

    	function input5_input_handler() {
    		email = this.value;
    		$$invalidate(5, email);
    	}

    	function input6_input_handler() {
    		website = this.value;
    		$$invalidate(7, website);
    	}

    	function textarea_input_handler() {
    		address = this.value;
    		$$invalidate(6, address);
    	}

    	$$self.$capture_state = () => ({
    		name,
    		title,
    		company,
    		countryCode,
    		phoneNumber,
    		email,
    		address,
    		website,
    		handleSubmit,
    		validateForm
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('company' in $$props) $$invalidate(2, company = $$props.company);
    		if ('countryCode' in $$props) $$invalidate(3, countryCode = $$props.countryCode);
    		if ('phoneNumber' in $$props) $$invalidate(4, phoneNumber = $$props.phoneNumber);
    		if ('email' in $$props) $$invalidate(5, email = $$props.email);
    		if ('address' in $$props) $$invalidate(6, address = $$props.address);
    		if ('website' in $$props) $$invalidate(7, website = $$props.website);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		title,
    		company,
    		countryCode,
    		phoneNumber,
    		email,
    		address,
    		website,
    		handleSubmit,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_input_handler,
    		input6_input_handler,
    		textarea_input_handler
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
