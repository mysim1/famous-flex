/* We respect the original MIT open-source license with regards to give credit to the original author Hein Rutjes.
 * any variations, changes and additions are NPOSL-3 licensed.
 * WE INTENT TO REPLACE FAMOUS-FLEX completely in the near future. As in ASAP.
 *
 * @author Hans van den Akker
 * @license NPOSL-3.0
 * @copyright Arva 2015-2017
 */

/*global console*/
/*eslint no-console: 0*/

/**
 * LayoutController lays out renderables according to a layout-
 * function and a data-source.
 *
 * Events:
 *
 * |event      |description|
 * |-----------|-----------|
 * |layoutstart|Emitted before the layout function is executed.|
 * |layoutend  |Emitted after the layout function has been executed.|
 * |reflow     |Emitted after one or more renderables have been changed.|
 *
 * @module
 */

import NativeScrollGroup from 'famous/core/NativeScrollGroup.js';
import Utility from 'famous/utilities/Utility.js';
import Entity from 'famous/core/Entity.js';
import ViewSequence from 'famous/core/ViewSequence.js';
import LinkedListViewSequence from './LinkedListViewSequence.js';
import OptionsManager from 'famous/core/OptionsManager.js';
import EventHandler from 'famous/core/EventHandler.js';
import LayoutUtility from './LayoutUtility.js';
import LayoutNodeManager from './LayoutNodeManager.js';
import LayoutNode from './LayoutNode.js';
import FlowLayoutNode from './FlowLayoutNode.js';
import Transform from 'famous/core/Transform.js';
import './helpers/LayoutDockHelper.js';

export default class LayoutController {

    /**
     * @class
     * @param {Object} options Options.
     * @param {Function|Object} [options.layout] Layout function or layout-literal.
     * @param {Object} [options.layoutOptions] Options to pass in to the layout-function.
     * @param {Array|LinkedListViewSequence|Object} [options.dataSource] Array, LinkedListViewSequence or Object with key/value pairs.
     * @param {Utility.Direction} [options.direction] Direction to layout into (e.g. Utility.Direction.Y) (when omitted the default direction of the layout is used)
     * @param {Bool} [options.flow] Enables flow animations when the layout changes (default: `false`).
     * @param {Object} [options.flowOptions] Options used by nodes when reflowing.
     * @param {Bool} [options.flowOptions.reflowOnResize] Smoothly reflows renderables on resize (only used when flow = true) (default: `true`).
     * @param {Object} [options.flowOptions.spring] Spring options used by nodes when reflowing (default: `{dampingRatio: 0.8, period: 300}`).
     * @param {Object} [options.flowOptions.properties] Properties which should be enabled or disabled for flowing.
     * @param {Spec} [options.flowOptions.insertSpec] Size, transform, opacity... to use when inserting new renderables into the scene (default: `{}`).
     * @param {Spec} [options.flowOptions.removeSpec] Size, transform, opacity... to use when removing renderables from the scene (default: undefined).
     * @param {Bool} [options.alwaysLayout] When set to true, always calls the layout function on every render-cycle (default: `false`).
     * @param {Bool} [options.autoPipeEvents] When set to true, automatically calls .pipe on all renderables when inserted (default: `false`).
     * @param {Object} [options.preallocateNodes] Optimisation option to improve initial scrolling/animation performance by pre-allocating nodes, e.g.: `{count: 50, spec: {size:[0, 0], transform: Transform.identity}}`.
     * @alias module:LayoutController
     */
    constructor(options, nodeManager) {

        // Commit
        this.id = Entity.register(this);
        this._isDirty = true;
        this._contextSizeCache = [0, 0];
        this._commitOutput = {};
        this._dirtyRenderables = [];

        // Create an object to we can capture the famo.us cleanup call on
        // LayoutController.
        this._cleanupRegistration = {
            commit: () => {
                return undefined;
            },
            cleanup: (context) => {
                this.cleanup(context);
            }
        };
        this._cleanupRegistration.target = Entity.register(this._cleanupRegistration);
        this._cleanupRegistration.render = function () {
            return this.target;
        }.bind(this._cleanupRegistration);

        // Setup input event handler
        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        // Setup event handlers
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        if (options.nativeScroll) {
            // Create groupt for faster rendering
            this.group = new NativeScrollGroup();
            this.group.add({ render: this._innerRender.bind(this) });
        }

        // Layout
        this._layout = {
            //function: undefined,
            //literal: undefined,
            //capabilities: undefined,
            options: Object.create({})
        };
        //this._direction = undefined;
        this._layout.optionsManager = new OptionsManager(this._layout.options);
        this._layout.optionsManager.on('change', () => {
            this._isDirty = true;
        });

        // Create options
        this.options = Object.create(LayoutController.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        // Create node manager that manages (Flow)LayoutNode instances
        if (nodeManager) {
            this._nodes = nodeManager;
        }
        //TODO: Make some solution that does flow not just on the view but on the renderables
        else if (options && options.flow) {
            this._nodes = new LayoutNodeManager(FlowLayoutNode, this._initFlowLayoutNode, options.partialFlow);
        }
        else {
            this._nodes = new LayoutNodeManager(LayoutNode, null, false);
        }

        // Set options
        this.setDirection(undefined);
        if (options) {
            this.setOptions(options);
        }
    }

    static DEFAULT_OPTIONS = {
        flow: false,
        partialFlow: false,
        flowOptions: {
            reflowOnResize: true,
            properties: {
                opacity: true,
                align: true,
                origin: true,
                size: true,
                translate: true,
                skew: true,
                rotate: true,
                scale: true
            },
            spring: {
                dampingRatio: 0.8,
                period: 300
            }
            /*insertSpec: {
             opacity: undefined,
             size: undefined,
             transform: undefined,
             origin: undefined,
             align: undefined
             },
             removeSpec: {
             opacity: undefined,
             size: undefined,
             transform: undefined,
             origin: undefined,
             align: undefined
             }*/
        }
    }

    /**
     * Called whenever a layout-node is created/re-used. Initializes
     * the node with the `insertSpec` if it has been defined.
     */
    _initFlowLayoutNode(node, spec) {
        if (!spec && this.options.flowOptions.insertSpec) {
            node.setSpec(this.options.flowOptions.insertSpec);
        }
    }

    /**
     * Patches the LayoutController instance's options with the passed-in ones.
     *
     * @param {Options} options An object of configurable options for the LayoutController instance.
     * @param {Function|Object} [options.layout] Layout function or layout-literal.
     * @param {Object} [options.layoutOptions] Options to pass in to the layout-function.
     * @param {Array|LinkedListViewSequence|Object} [options.dataSource] Array, LinkedListViewSequence or Object with key/value pairs.
     * @param {Utility.Direction} [options.direction] Direction to layout into (e.g. Utility.Direction.Y) (when omitted the default direction of the layout is used)
     * @param {Object} [options.flowOptions] Options used by nodes when reflowing.
     * @param {Bool} [options.flowOptions.reflowOnResize] Smoothly reflows renderables on resize (only used when flow = true) (default: `true`).
     * @param {Object} [options.flowOptions.spring] Spring options used by nodes when reflowing (default: `{dampingRatio: 0.8, period: 300}`).
     * @param {Object} [options.flowOptions.properties] Properties which should be enabled or disabled for flowing.
     * @param {Spec} [options.flowOptions.insertSpec] Size, transform, opacity... to use when inserting new renderables into the scene (default: `{}`).
     * @param {Spec} [options.flowOptions.removeSpec] Size, transform, opacity... to use when removing renderables from the scene (default: `{}`).
     * @param {Bool} [options.alwaysLayout] When set to true, always calls the layout function on every render-cycle (default: `false`).
     * @return {LayoutController} this
     */
    setOptions(options) {
        if ((options.alignment !== undefined) && (options.alignment !== this.options.alignment)) {
            this._isDirty = true;
        }
        this._optionsManager.setOptions(options);
        if (options.nodeSpring) {
            console.warn('nodeSpring options have been moved inside `flowOptions`. Use `flowOptions.spring` instead.');
            this._optionsManager.setOptions({
                flowOptions: {
                    spring: options.nodeSpring
                }
            });
            this._nodes.setNodeOptions(this.options.flowOptions);
        }
        if (options.reflowOnResize !== undefined) {
            console.warn('reflowOnResize options have been moved inside `flowOptions`. Use `flowOptions.reflowOnResize` instead.');
            this._optionsManager.setOptions({
                flowOptions: {
                    reflowOnResize: options.reflowOnResize
                }
            });
            this._nodes.setNodeOptions(this.options.flowOptions);
        }
        if (options.insertSpec) {
            console.warn('insertSpec options have been moved inside `flowOptions`. Use `flowOptions.insertSpec` instead.');
            this._optionsManager.setOptions({
                flowOptions: {
                    insertSpec: options.insertSpec
                }
            });
            this._nodes.setNodeOptions(this.options.flowOptions);
        }
        if (options.removeSpec) {
            console.warn('removeSpec options have been moved inside `flowOptions`. Use `flowOptions.removeSpec` instead.');
            this._optionsManager.setOptions({
                flowOptions: {
                    removeSpec: options.removeSpec
                }
            });
            this._nodes.setNodeOptions(this.options.flowOptions);
        }
        if (options.dataSource) {
            this.setDataSource(options.dataSource);
        }
        if (options.layout) {
            this.setLayout(options.layout, options.layoutOptions);
        }
        else if (options.layoutOptions) {
            this.setLayoutOptions(options.layoutOptions);
        }
        if (options.direction !== undefined) {
            this.setDirection(options.direction);
        }
        if (options.flowOptions && this.options.flow) {
            this._nodes.setNodeOptions(this.options.flowOptions);
        }
        if (options.preallocateNodes) {
            this._nodes.preallocateNodes(options.preallocateNodes.count || 0, options.preallocateNodes.spec);
        }
        return this;
    }

    /**
     * Helper function to enumerate all the renderables in the datasource
     */
    _forEachRenderable(callback) {
        if (this._nodesById) {
            for (let key in this._nodesById) {
                callback(this._nodesById[key]);
            }
        }
        else {
            let sequence = this._viewSequence.getHead();
            while (sequence) {
                let renderable = sequence.get();
                if (renderable) {
                    callback(renderable);
                }
                sequence = sequence.getNext();
            }
        }
    }

    /**
     * Sets the collection of renderables which are layed out according to
     * the layout-function.
     *
     * The data-source can be either an Array, LinkedListViewSequence or Object
     * with key/value pairs.
     *
     * @param {Array|Object|LinkedListViewSequence} dataSource Array, LinkedListViewSequence or Object.
     * @return {LayoutController} this
     */
    setDataSource(dataSource) {
        this._dataSource = dataSource;
        this._nodesById = undefined;
        if (dataSource instanceof ViewSequence) {
            console.warn('The stock famo.us ViewSequence is no longer supported as it is too buggy');
            console.warn('It has been automatically converted to the safe LinkedListViewSequence.');
            console.warn('Please refactor your code by using LinkedListViewSequence.');
            this._dataSource = new LinkedListViewSequence(dataSource._.array);
            this._viewSequence = this._dataSource;
        }
        else if (dataSource instanceof Array) {
            this._viewSequence = new LinkedListViewSequence(dataSource);
            this._dataSource = this._viewSequence;
        }
        else if (dataSource instanceof LinkedListViewSequence) {
            this._viewSequence = dataSource;
        }
        else if (dataSource.getNext) {
            this._viewSequence = dataSource;
        }
        else if (dataSource instanceof Object) {
            this._nodesById = dataSource;
        }
        if (this.options.autoPipeEvents) {
            if (this._dataSource.pipe) {
                this._dataSource.pipe(this);
                this._dataSource.pipe(this._eventOutput);
            }
            else {
                this._forEachRenderable((renderable) => {
                    if (renderable && renderable.pipe) {
                        renderable.pipe(this);
                        renderable.pipe(this._eventOutput);
                    }
                });
            }
        }
        this._isDirty = true;
        return this;
    }

    /**
     * Get the data-source.
     *
     * @return {Array|LinkedListViewSequence|Object} data-source
     */
    getDataSource() {
        return this._dataSource;
    }

    /**
     * Set the new layout.
     *
     * @param {Function|Object} layout Layout function or layout-literal
     * @param {Object} [options] Options to pass in to the layout-function
     * @return {LayoutController} this
     */
    setLayout(layout, options) {

        // Set new layout funtion
        if (layout instanceof Function) {
            this._layout._function = layout;
            this._layout.capabilities = layout.Capabilities;
            this._layout.literal = undefined;

            // If the layout is an object, treat it as a layout-literal
        }
        else if (layout instanceof Object) {
            this._layout.literal = layout;
            this._layout.capabilities = undefined; // todo - derive from literal somehow?
            let helperName = Object.keys(layout)[0];
            let Helper = LayoutUtility.getRegisteredHelper(helperName);
            this._layout._function = Helper ? function (context, options2) {
                let helper = new Helper(context, options2);
                helper.parse(layout[helperName]);
            } : undefined;
        }
        else {
            this._layout._function = undefined;
            this._layout.capabilities = undefined;
            this._layout.literal = undefined;
        }

        // Update options
        if (options) {
            this.setLayoutOptions(options);
        }

        // Update direction
        this.setDirection(this._configuredDirection);
        this._isDirty = true;
        return this;
    }

    /**
     * Get the current layout.
     *
     * @return {Function|Object} Layout function or layout literal
     */
    getLayout() {
        return this._layout.literal || this._layout._function;
    }

    /**
     * Set the options for the current layout. Use this function after
     * `setLayout` to update one or more options for the layout-function.
     *
     * @param {Object} [options] Options to pass in to the layout-function
     * @return {LayoutController} this
     */
    setLayoutOptions(options) {
        this._layout.optionsManager.setOptions(options);
        return this;
    }

    /**
     * Get the current layout options.
     *
     * @return {Object} Layout options
     */
    getLayoutOptions() {
        return this._layout.options;
    }

    /**
     * Calculates the actual in-use direction based on the given direction
     * and supported capabilities of the layout-function.
     */
    _getActualDirection(direction) {

        // When the direction is configured in the capabilities, look it up there
        if (this._layout.capabilities && this._layout.capabilities.direction) {

            // Multiple directions are supported
            if (Array.isArray(this._layout.capabilities.direction)) {
                for (let i = 0; i < this._layout.capabilities.direction.length; i++) {
                    if (this._layout.capabilities.direction[i] === direction) {
                        return direction;
                    }
                }
                return this._layout.capabilities.direction[0];
            }

            // Only one direction is supported, we must use that
            else {
                return this._layout.capabilities.direction;
            }
        }

        // Use Y-direction as a fallback
        return (direction === undefined) ? Utility.Direction.Y : direction;
    }

    /**
     * Set the direction of the layout. When no direction is set, the default
     * direction of the layout function is used.
     *
     * @param {Utility.Direction} direction Direction (e.g. Utility.Direction.X)
     * @return {LayoutController} this
     */
    setDirection(direction) {
        this._configuredDirection = direction;
        let newDirection = this._getActualDirection(direction);
        if (newDirection !== this._direction) {
            this._direction = newDirection;
            this._isDirty = true;
        }
    }

    /**
     * Get the direction (e.g. Utility.Direction.Y). By default, this function
     * returns the direction that was configured by setting `setDirection`. When
     * the direction has not been set, `undefined` is returned.
     *
     * When no direction has been set, the first direction is used that is specified
     * in the capabilities of the layout-function. To obtain the actual in-use direction,
     * use `getDirection(true)`. This method returns the actual in-use direction and
     * never returns undefined.
     *
     * @param {Boolean} [actual] Set to true to obtain the actual in-use direction
     * @return {Utility.Direction} Direction or undefined
     */
    getDirection(actual) {
        return actual ? this._direction : this._configuredDirection;
    }

    /**
     * Get the spec (size, transform, etc..) for the given renderable or
     * Id.
     *
     * @param {Renderable|String} node Renderabe or Id to look for
     * @param {Bool} [normalize] When set to `true` normalizes the origin/align into the transform translation (default: `false`).
     * @param {Bool} [endState] When set to `true` returns the flowing end-state spec rather than the current spec.
     * @return {Spec} spec or undefined
     */
    getSpec(node, normalize, endState) {
        if (!node) {
            return undefined;
        }
        if ((node instanceof String) || (typeof node === 'string')) {
            if (!this._nodesById) {
                return undefined;
            }
            node = this._nodesById[node];
            if (!node) {
                return undefined;
            }

            // If the result was an array, return that instead
            if (node instanceof Array) {
                return node;
            }
        }
        if (this._specs) {
            for (let i = 0; i < this._specs.length; i++) {
                let spec = this._specs[i];
                if (spec.renderNode === node) {
                    if (endState && spec.endState) {
                        spec = spec.endState;
                    }
                    // normalize align & origin into transform
                    if (normalize && spec.transform && spec.size && (spec.align || spec.origin)) {
                        let transform = spec.transform;
                        if (spec.align && (spec.align[0] || spec.align[1])) {
                            transform = Transform.thenMove(transform, [spec.align[0] * this._contextSizeCache[0], spec.align[1] * this._contextSizeCache[1], 0]);
                        }
                        if (spec.origin && (spec.origin[0] || spec.origin[1])) {
                            transform = Transform.moveThen([-spec.origin[0] * spec.size[0], -spec.origin[1] * spec.size[1], 0], transform);
                        }
                        return {
                            opacity: spec.opacity,
                            size: spec.size,
                            transform: transform
                        };
                    }
                    return spec;
                }
            }
        }
        return undefined;
    }

    /**
     * Forces a reflow of the layout the next render cycle.
     *
     * @return {LayoutController} this
     */
    reflowLayout() {
        this._isDirty = true;
        return this;
    }

    /**
     * Resets the current flow state, so that all renderables
     * are immediately displayed in their end-state.
     *
     * @return {LayoutController} this
     */
    resetFlowState() {
        if (this.options.flow) {
            this._resetFlowState = true;
        }
        return this;
    }

    /**
     * Inserts a renderable into the data-source.
     *
     * The optional argument `insertSpec` is only used `flow` mode is enabled.
     * When specified, the renderable is inserted using an animation starting with
     * size, origin, opacity, transform, etc... as specified in `insertSpec'.
     *
     * @param {Number|String} indexOrId Index (0 = before first, -1 at end), within dataSource array or id (String)
     * @param {Object} renderable Renderable to add to the data-source
     * @param {Spec} [insertSpec] Size, transform, etc.. to start with when inserting
     * @return {LayoutController} this
     */
    insert(indexOrId, renderable, insertSpec) {
        insertSpec = insertSpec || this.options.flowOptions.insertSpec;

        // Add the renderable in case of an id (String)
        if ((indexOrId instanceof String) || (typeof indexOrId === 'string')) {

            // Create data-source if neccesary
            if (this._dataSource === undefined) {
                this._dataSource = {};
                this._nodesById = this._dataSource;
            }

            // Insert renderable
            if (this._nodesById[indexOrId] === renderable) {
                return this;
            }
            this._nodesById[indexOrId] = renderable;
        }

        // Add the renderable using an index
        else {

            // Create own data-source if neccesary
            if (this._dataSource === undefined) {
                this._dataSource = new LinkedListViewSequence();
                this._viewSequence = this._dataSource;
            }

            // Insert data
            this._viewSequence.insert(indexOrId, renderable);
        }

        // When a custom insert-spec was specified, store that in the layout-node
        if (insertSpec) {
            let newNode = this._nodes.createNode(renderable, insertSpec);
            newNode.executeInsertSpec && newNode.executeInsertSpec();
            this._nodes.insertNode(newNode);
        }

        // Auto pipe events
        if (this.options.autoPipeEvents && renderable && renderable.pipe) {
            renderable.pipe(this);
            renderable.pipe(this._eventOutput);
        }

        // Force a reflow
        this._isDirty = true;

        this._dirtyRenderables.push(renderable);


        return this;
    }

    /**
     * Adds a renderable to the end of a sequential data-source.
     *
     * The optional argument `insertSpec` is only used `flow` mode is enabled.
     * When specified, the renderable is inserted using an animation starting with
     * size, origin, opacity, transform, etc... as specified in `insertSpec'.
     *
     * @param {Object} renderable Renderable to add to the data-source
     * @param {Spec} [insertSpec] Size, transform, etc.. to start with when inserting
     * @return {LayoutController} this
     */
    push(renderable, insertSpec) {
        return this.insert(-1, renderable, insertSpec);
    }

    /**
     * Helper function for finding the view-sequence node at the given position.
     */
    _getViewSequenceAtIndex(index, startViewSequence) {
        if (this._viewSequence.getAtIndex) {
            return this._viewSequence.getAtIndex(index, startViewSequence);
        }
        let viewSequence = startViewSequence || this._viewSequence;
        let i = viewSequence ? viewSequence.getIndex() : index;
        if (index > i) {
            while (viewSequence) {
                viewSequence = viewSequence.getNext();
                if (!viewSequence) {
                    return undefined;
                }
                i = viewSequence.getIndex();
                if (i === index) {
                    return viewSequence;
                }
                else if (index < i) {
                    return undefined;
                }
            }
        }
        else if (index < i) {
            while (viewSequence) {
                viewSequence = viewSequence.getPrevious();
                if (!viewSequence) {
                    return undefined;
                }
                i = viewSequence.getIndex();
                if (i === index) {
                    return viewSequence;
                }
                else if (index > i) {
                    return undefined;
                }
            }
        }
        return viewSequence;
    }

    /**
     * Get the renderable at the given index or Id.
     *
     * @param {Number|String} indexOrId Index within dataSource array or id (String)
     * @return {Renderable} renderable or `undefined`
     */
    get(indexOrId) {
        if (this._nodesById || (indexOrId instanceof String) || (typeof indexOrId === 'string')) {
            return this._nodesById ? this._nodesById[indexOrId] : undefined;
        }
        let viewSequence = this._getViewSequenceAtIndex(indexOrId);
        return viewSequence ? viewSequence.get() : undefined;
    }

    /**
     * Swaps two renderables at the given positions.
     *
     * This method is only supported for dataSources of type Array or LinkedListViewSequence.
     *
     * @param {Number} index Index of the renderable to swap
     * @param {Number} index2 Index of the renderable to swap with
     * @return {LayoutController} this
     */
    swap(index, index2) {
        this._viewSequence.swap(index, index2);
        this._isDirty = true;
        return this;
    }

    /**
     * Replaces a renderable at the given index or id.
     *
     * @param {Number|String} indexOrId Index within dataSource array or id (String)
     * @param {Renderable} renderable renderable to replace with
     * @param {Bool} [noAnimation] When set to `true`, replaces the renderable without any flowing animation.
     * @return {Renderable} old renderable that has been replaced
     */
    replace(indexOrId, renderable, noAnimation, sequence) {
        let oldRenderable;
        if (this._nodesById || (indexOrId instanceof String) || (typeof indexOrId === 'string')) {
            oldRenderable = this._nodesById[indexOrId];
            if (oldRenderable !== renderable) {
                if (noAnimation && oldRenderable) {
                    let node = this._nodes.getNodeByRenderNode(oldRenderable);
                    if (node) {
                        node.setRenderNode(renderable);
                    }
                }
                this._nodesById[indexOrId] = renderable;
                this._isDirty = true;
            }
            return oldRenderable;
        }
        if (!sequence) {
            sequence = this._viewSequence.findByIndex(indexOrId);
        }
        if (!sequence) {
            throw 'Invalid index (' + indexOrId + ') specified to .replace';
        }
        oldRenderable = sequence.get();
        sequence.set(renderable);
        if (oldRenderable !== renderable) {
            if (noAnimation && oldRenderable) {
                let node = this._nodes.getNodeByRenderNode(oldRenderable);
                if (node) {
                    node.setRenderNode(renderable);
                }
            } else {
                this._isDirty = true;
            }

        }
        return oldRenderable;
    };

    /**
     * Moves a renderable to a new index.
     *
     * This method is only supported for dataSources of type Array or LinkedListViewSequence.
     *
     * @param {Number} index Index of the renderable to move.
     * @param {Number} newIndex New index of the renderable.
     * @return {LayoutController} this
     */
    move(index, newIndex) {
        let sequence = this._viewSequence.findByIndex(index);
        if (!sequence) {
            throw 'Invalid index (' + index + ') specified to .move';
        }
        this._viewSequence = this._viewSequence.remove(sequence);
        this._viewSequence.insert(newIndex, sequence.get());
        this._isDirty = true;
        return this;
    }

    /**
     * Removes a renderable from the data-source.
     *
     * The optional argument `removeSpec` is only used `flow` mode is enabled.
     * When specified, the renderable is removed using an animation ending at
     * the size, origin, opacity, transform, etc... as specified in `removeSpec'.
     *
     * @param {Number|String|Renderable} indexOrId Index, id (String) or renderable to remove.
     * @param {Spec} [removeSpec] Size, transform, etc.. to end with when removing
     * @return {Renderable} renderable that has been removed
     */
    remove(indexOrId, removeSpec) {
        let renderNode;

        // Remove the renderable in case of an id (String)
        if (this._nodesById || (indexOrId instanceof String) || (typeof indexOrId === 'string')) {

            // Find and remove renderable from data-source
            if ((indexOrId instanceof String) || (typeof indexOrId === 'string')) {
                renderNode = this._nodesById[indexOrId];
                if (renderNode) {
                    delete this._nodesById[indexOrId];
                }
            }
            else {
                for (let key in this._nodesById) {
                    if (this._nodesById[key] === indexOrId) {
                        delete this._nodesById[key];
                        renderNode = indexOrId;
                        break;
                    }
                }
            }
        }
        else {

            // Remove the renderable
            let sequence;
            if ((indexOrId instanceof Number) || (typeof indexOrId === 'number')) {
                sequence = this._viewSequence.findByIndex(indexOrId);
            }
            else {
                sequence = this._viewSequence.findByValue(indexOrId);
            }
            if (sequence) {
                renderNode = sequence.get();
                this._viewSequence = this._viewSequence.remove(sequence);
            }
        }

        // When a custom remove-spec was specified, store that in the layout-node
        if (renderNode && removeSpec) {
            let node = this._nodes.getNodeByRenderNode(renderNode);
            if (node) {
                node.remove(removeSpec || this.options.flowOptions.removeSpec);
            }
        }

        // Force a reflow
        if (renderNode) {
            this._isDirty = true;
        }

        return renderNode;
    }

    /**
     * Removes all renderables from the data-source.
     *
     * The optional argument `removeSpec` is only used when `flow` mode is enabled.
     * When specified, the renderables are removed using an animation ending at
     * the size, origin, opacity, transform, etc... as specified in `removeSpec'.
     *
     * @param {Spec} [removeSpec] Size, transform, etc.. to end with when removing
     * @return {LayoutController} this
     */
    removeAll(removeSpec) {
        if (this._nodesById) {
            let dirty = false;
            for (let key in this._nodesById) {
                delete this._nodesById[key];
                dirty = true;
            }
            if (dirty) {
                this._isDirty = true;
            }
        }
        else if (this._viewSequence) {
            this._viewSequence = this._viewSequence.clear();
        }
        if (removeSpec) {
            let node = this._nodes.getStartEnumNode();
            while (node) {
                node.remove(removeSpec || this.options.flowOptions.removeSpec);
                node = node._next;
            }
        }
        return this;
    }

    /**
     * Return size of contained element or `undefined` when size is not defined.
     *
     * @return {Array.Number} [width, height]
     */
    getSize() {
        return this._size || this.options.size;
    }

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    render() {
        return this.id;
    }

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    commit(context) {
        let transform = context.transform;
        let origin = context.origin;
        let size = context.size;
        let opacity = context.opacity;

        // Reset the flow-state when requested
        if (this._resetFlowState) {
            this._resetFlowState = false;
            this._isDirty = true;
            this._nodes.removeAll();
        }

        this._isDisplaying = true;
        let sizeChanged = size[0] !== this._contextSizeCache[0] ||
            size[1] !== this._contextSizeCache[1];
        if (sizeChanged) {
            this._eventOutput.emit('sizeChanged', {
                oldSize: this._contextSizeCache,
                size: size,
            });
        }

        // When the size or layout function has changed, reflow the layout
        if ((
                sizeChanged ||
                this._isDirty ||
                this._nodes._trueSizeRequested ||
                this.options.alwaysLayout
            )
        ) {

            // Emit start event
            let eventData = {
                target: this,
                oldSize: this._contextSizeCache,
                size: size,
                dirty: this._isDirty,
                trueSizeRequested: this._nodes._trueSizeRequested
            };
            this._eventOutput.emit('layoutstart', eventData);

            // When the layout has changed, and we are not just scrolling,
            // disable the locked state of the layout-nodes so that they
            // can freely transition between the old and new state.
            if (this.options.flow) {
                let lock = false;
                if (!this.options.flowOptions.reflowOnResize) {
                    if (!this._isDirty &&
                        ((size[0] !== this._contextSizeCache[0]) ||
                        (size[1] !== this._contextSizeCache[1]))) {
                        lock = undefined;
                    }
                    else {
                        lock = true;
                    }
                }
                if (lock !== undefined) {
                    let node = this._nodes.getStartEnumNode();
                    while (node) {
                        if (node.releaseLock) {
                            node.releaseLock(lock);
                        }
                        node = node._next;
                    }
                }
            }

            // Update state
            this._contextSizeCache[0] = size[0];
            this._contextSizeCache[1] = size[1];
            this._isDirty = false;

            // Prepare for layout
            let scrollEnd;
            if (this.options.size && (this.options.size[this._direction] === true)) {
                scrollEnd = 1000000; // calculate scroll-length
            }
            let layoutContext = this._nodes.prepareForLayout(
                this._viewSequence,     // first node to layout
                this._nodesById, {      // so we can do fast id lookups
                    size: size,
                    direction: this._direction,
                    scrollEnd: scrollEnd
                }
            );

            // Layout objects
            if (this._layout._function) {
                this._layout._function(
                    layoutContext,          // context which the layout-function can use
                    this._layout.options    // additional layout-options
                );
            }

            // Mark non-invalidated nodes for removal
            this._nodes.removeNonInvalidatedNodes(this.options.flowOptions.removeSpec);

            // Cleanup any nodes in case of a VirtualViewSequence
            this._nodes.removeVirtualViewSequenceNodes();

            // Calculate scroll-length and use that as the true-size (height)
            if (scrollEnd) {
                scrollEnd = 0;
                node = this._nodes.getStartEnumNode();
                while (node) {
                    if (node._invalidated && node.scrollLength) {
                        scrollEnd += node.scrollLength;
                    }
                    node = node._next;
                }
                this._size = this._size || [0, 0];
                this._size[0] = this.options.size[0];
                this._size[1] = this.options.size[1];
                this._size[this._direction] = scrollEnd;
            }

            // Update output and optionally emit event
            let result = this._nodes.buildSpecAndDestroyUnrenderedNodes();
            this._specs = result.specs;
            this._commitOutput.target = result.specs;
            this._eventOutput.emit('layoutend', eventData);
            this._eventOutput.emit('reflow', {
                target: this
            });
            this._lastResultUntouched = false;
        }
        else if (this.options.flow && !this._lastResultUntouched) {
            // Update output and optionally emit event
            result = this._nodes.buildSpecAndDestroyUnrenderedNodes();
            this._specs = result.specs;
            this._commitOutput.target = result.specs;
            if (result.modified) {
                this._eventOutput.emit('reflow', {
                    target: this
                });
            }
            this._lastResultUntouched = !result.modified;
        }


        // Render child-nodes every commit
        let target = this._commitOutput.target;
        for (let i = 0, j = target.length; i < j; i++) {
            if (target[i].renderNode) {
                target[i].target = target[i].renderNode.render();
            }
        }

        // Add our cleanup-registration id also to the list, so that the
        // cleanup function is called by famo.us when the LayoutController is
        // removed from the render-tree.
        if (!target.length || (target[target.length - 1] !== this._cleanupRegistration)) {
            target.push(this._cleanupRegistration);
        }


        // Translate dependent on origin
        if (origin && ((origin[0] !== 0) || (origin[1] !== 0))) {
            transform = Transform.moveThen([-size[0] * origin[0], -size[1] * origin[1], 0], transform);
        }
        if (this.globalTransform) {
            transform = Transform.multiply(transform, this.globalTransform);
        }

        this._commitOutput.size = size;
        this._commitOutput.opacity = opacity;
        this._commitOutput.transform = transform;

        if (this.options.nativeScroll) {
            // Return the spec
            return {
                transform: transform,
                size: size,
                opacity: opacity,
                target: this.group.render()
            };
        }

        return this._commitOutput;
    }

    _innerRender() {
        return this._commitOutput.target;
    }

    /**
     * Called whenever the layout-controller is removed from the render-tree.
     *
     * @private
     * @param {Context} context cleanup context
     */
    cleanup(context) {
        if (this.options.flow) {
            this._resetFlowState = true;
        }
        this._isDisplaying = false;
    }


    /**
     * Determine whether the item currently is being rendered by Famous
     * @returns {boolean} True if being rendered
     */
    isDisplaying() {
        return this._isDisplaying;
    }
}
