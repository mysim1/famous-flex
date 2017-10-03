/* We respect the original MIT open-source license with regards to give credit to the original author Hein Rutjes.
 * any variations, changes and additions are NPOSL-3 licensed.
 * WE INTENT TO REPLACE FAMOUS-FLEX completely in the near future. As in ASAP.
 *
 * @author Hans van den Akker
 * @license NPOSL-3.0
 * @copyright Arva 2015-2017
 */

/**
 * LayoutNodeManager is a private class used internally by LayoutController, ScrollController
 * and ScrollView. It manages the layout-nodes that are rendered and exposes the layout-context
 * which is passed along to the layout-function.
 *
 * LayoutNodeManager keeps track of every rendered node through an ordered double-linked
 * list. The first time the layout-function is called, the linked list is created.
 * After that, the linked list is updated to reflect the output of the layout-function.
 * When the layout is unchanged, then the linked-list exactly matches the order of the
 * accessed nodes in the layout-function, and no layout-nodes need to be created or
 * re-ordered.
 *
 * @module
 */

import LayoutContext from './LayoutContext.js';
import LayoutUtility from './LayoutUtility.js';
import Surface from 'famous/core/Surface.js';
import RenderNode from 'famous/core/RenderNode.js';
import FlowLayoutNode from './FlowLayoutNode.js';
import LayoutNode from './LayoutNode.js';


export default class LayoutNodeManager {

    static MAX_POOL_SIZE = 100;

    /**
     * @class
     * @param {LayoutNode} LayoutNode Layout-nodes to create
     * @param {Function} initLayoutNodeFn function to use when initializing new nodes
     * @param {Boolean} partialFlow Sets
     * @alias module:LayoutNodeManager
     */
    constructor(LayoutNode, initLayoutNodeFn, partialFlow) {
        this.LayoutNode = LayoutNode;
        this._partialFlow = partialFlow || false;
        this._initLayoutNodeFn = initLayoutNodeFn;
        this._layoutCount = 0;
        this._context = new LayoutContext({
            next: this._contextNext,
            prev: this._contextPrev,
            get: this._contextGet,
            set: this._contextSet,
            resolveSize: this._contextResolveSize,
            moveStartSequence: this._moveStartSequence,
            size: [0, 0],
            setCoveredScrollHeight: this._setCoveredScrollHeight
            //,cycle: 0
        });
        this._contextState = {
            // enumation state for the context
            //nextSequence: undefined,
            //prevSequence: undefined,
            //next: undefined
            //prev: undefined
            //start: undefined
        };
        this._pool = {
            layoutNodes: {
                size: 0
                //first: undefined
            },
            resolveSize: [0, 0]
        };
        //this._first = undefined; // first item in the linked list
        //this._nodesById = undefined;
        //this._trueSizeRequested = false;
    }

    /**
     * Prepares the manager for a new layout iteration, after which it returns the
     * context which can be used by the layout-function.
     *
     * @param {ViewSequence} viewSequence first node to layout
     * @param {Object} [nodesById] dictionary to use when looking up nodes by id
     * @return {LayoutContext} context which can be passed to the layout-function
     */

    prepareForLayout(viewSequence, nodesById, contextData) {
        this._startSequence = null;
        this._sequenceMovedDirection = 0;
        // Reset all nodes
        var node = this._first;
        while (node) {
            node.reset();
            node = node._next;
        }
        this._nodeIdInCurrentBuild = new Map();

        // Prepare data
        var context = this._context;
        this._layoutCount++;
        this._nodesById = nodesById;
        this._trueSizeRequested = false;
        this._reevalTrueSize =
            contextData.reevalTrueSize ||
            !context.size ||
            (context.size[0] !== contextData.size[0]) ||
            (context.size[1] !== contextData.size[1]);

        // Prepare context for enumation
        var contextState = this._contextState;
        contextState.startSequence = viewSequence;
        contextState.nextSequence = viewSequence;
        contextState.prevSequence = viewSequence;
        contextState.start = undefined;

        contextState.nextGetIndex = 0;
        contextState.prevGetIndex = 0;
        contextState.nextSetIndex = 0;
        contextState.prevSetIndex = 0;
        contextState.addCount = 0;
        contextState.removeCount = 0;
        contextState.firstRenderNode = undefined;
        contextState.firstNode = undefined;
        contextState.lastNode = undefined;
        contextState.lastRenderNode = undefined;

        // Prepare content
        context.size[0] = contextData.size[0];
        context.size[1] = contextData.size[1];
        context.scrollLength = contextData.scrollLength;
        context.direction = contextData.direction;
        context.scrollTopHeight = contextData.scrollTopHeight;
        context.reverse = contextData.reverse;
        context.alignment = contextData.reverse ? 1 : 0;
        context.scrollOffset = contextData.scrollOffset || 0;
        context.scrollStart = contextData.scrollStart || 0;
        context.scrollEnd = contextData.scrollEnd || context.size[context.direction];
        //context.cycle++;
        return context;
    }

    /**
     * When the layout-function no longer lays-out the node, then it is not longer
     * being invalidated. In this case the destination is set to the removeSpec
     * after which the node is animated towards the remove-spec.
     *
     * @param {Spec} [removeSpec] spec towards which the no longer layed-out nodes are animated
     */
    removeNonInvalidatedNodes(removeSpec) {
        var node = this._first;
        while (node) {

            // If a node existed, but it is no longer being layed out,
            // then set it to the '_removing' state.
            if (!node._invalidated && !node._removing) {
                node.remove(removeSpec);
            }

            // Move to next node
            node = node._next;
        }
    }

    getPrevSequence= function() {
        return this._contextState.prevSequence;
    }

    getLastRenderNodeInSequence() {
        return this._contextState.startSequence.getTail().get();
    }

    getFirstRenderedNode() {
        return this._contextState.firstNode;
    }

    getLastRenderedNode() {
        return this._contextState.lastNode;
    }

    /**
     * Cleans up any unaccessed virtual nodes that have been created by a VirtualViewSequence.
     */

    removeVirtualViewSequenceNodes() {
        if (this._contextState.startSequence && this._contextState.startSequence.cleanup) {
            this._contextState.startSequence.cleanup();
        }
    }

    /**
     * Builds the render-spec and destroy any layout-nodes that no longer
     * return a render-spec.
     *
     * @return {Array<Object>} Object containing array of specs, array of nodes, etc
     */
    buildSpecAndDestroyUnrenderedNodes(translate) {
        var specs = [], nodes = [];
        var result = {
            specs: specs,
            nodes: nodes,
            modified: false
        };
        var node = this._first;
        while (node) {
            var spec = node.getSpec();
            var modified = node._specModified;
            if (spec.removed) {

                // Destroy node
                var destroyNode = node;
                node = node._next;
                this._destroyNode(destroyNode);

                // Mark as modified
                result.modified = true;
            }
            else {

                // Update stats
                if (modified) {
                    if (spec.transform && translate) {
                        spec.transform[12] += translate[0];
                        spec.transform[13] += translate[1];
                        spec.transform[14] += translate[2];
                        spec.transform[12] = Math.round(spec.transform[12] * 100000) / 100000;
                        spec.transform[13] = Math.round(spec.transform[13] * 100000) / 100000;
                        if (spec.endState) {
                            spec.endState.transform[12] += translate[0];
                            spec.endState.transform[13] += translate[1];
                            spec.endState.transform[14] += translate[2];
                            spec.endState.transform[12] = Math.round(spec.endState.transform[12] * 100000) / 100000;
                            spec.endState.transform[13] = Math.round(spec.endState.transform[13] * 100000) / 100000;
                        }
                    }
                    result.modified = true;
                }

                // Set meta data
                spec.usesTrueSize = node.usesTrueSize;
                spec.trueSizeRequested = node.trueSizeRequested;
                spec.target = spec.renderNode.render();
                // Add node to result output
                specs.push(spec);
                nodes.push(node);
                node = node._next;
            }
        }
        this._contextState.addCount = 0;
        this._contextState.removeCount = 0;
        return result;
    }

    /**
     * Get the layout-node by its renderable.
     *
     * @param {Object} renderable renderable
     * @return {LayoutNode} layout-node or undefined
     */
    getNodeByRenderNode(renderable) {
        var node = this._first;
        while (node) {
            if (node.renderNode === renderable) {
                return node;
            }
            node = node._next;
        }
        return undefined;
    }

    /**
     * Inserts a layout-node into the linked-list.
     *
     * @param {LayoutNode} node layout-node to insert
     */
    getCoveredScrollHeight() {
        return this._contextState.coveredScrollHeight;
    }
    /**
     * Inserts a layout-node into the linked-list.
     *
     * @param {LayoutNode} node layout-node to insert
     */
    insertNode(node) {
        node._next = this._first;
        if (this._first) {
            this._first._prev = node;
        }
        this._first = node;
    }

    /**
     * Sets the options for all nodes.
     *
     * @param {Object} options node options
     */
    setNodeOptions(options) {
        this._nodeOptions = options;
        var node = this._first;
        while (node) {
            node.setOptions(options);
            node = node._next;
        }
        node = this._pool.layoutNodes.first;
        while (node) {
            node.setOptions(options);
            node = node._next;
        }
    }

    /**
     * Pre-allocate layout-nodes ahead of using them.
     *
     * @param {Number} count number of nodes to pre-allocate with the given spec
     * @param {Spec} [spec] render-spec (defined the node properties which to pre-allocate)
     */
    preallocateNodes(count, spec) {
        var nodes = [];
        for (var i = 0; i < count; i++) {
            nodes.push(this.createNode(undefined, spec));
        }
        for (i = 0; i < count; i++) {
            this._destroyNode(nodes[i]);
        }
    }

    /**
     * Creates a layout-node
     *
     * @param {Object} renderNode render-node for whom to create a layout-node for
     * @return {LayoutNode} layout-node
     */
    createNode(renderNode, spec) {
        var node;
        var layoutNodeClass = this.getLayoutNodeClassForRenderNode(renderNode);
        if (this._pool.layoutNodes.first) {
            node = this._pool.layoutNodes.first;
            this._pool.layoutNodes.first = node._next;
            this._pool.layoutNodes.size--;
            if(this._partialFlow){
                node = new layoutNodeClass(renderNode, spec);
            } else {
                node.constructor.apply(node, arguments);
            }

        }
        else {
            node = new layoutNodeClass(renderNode, spec);

            if (this._nodeOptions) {
                node.setOptions(this._nodeOptions);
            }
        }
        node._prev = undefined;
        node._next = undefined;
        node._viewSequence = undefined;
        node._layoutCount = 0;
        if (this._initLayoutNodeFn) {
            this._initLayoutNodeFn(node, spec);
        }
        return node;
    }

    isSequenceMoved() {
        return !!this._sequenceMovedDirection;
    }

    getMovedSequenceDirection() {
        return this._sequenceMovedDirection;
    }

    getStartSequence() {
        return this._startSequence;
    }

    getLayoutNodeClassForRenderNode(renderNode) {
        if (this._partialFlow) {
            if (renderNode.isFlowy) {
                return FlowLayoutNode;
            } else {
                return LayoutNode;
            }
        }
      return this.LayoutNode;
    }
    /**
     * Removes all nodes.
     */
    removeAll() {
        var node = this._first;
        while (node) {
          var next = node._next;
          this._destroyNode(node);
          node = next;
        }
        this._first = undefined;
    }

    /**
     * Destroys a layout-node
     */
    function _destroyNode(node) {

        // Remove node from linked-list
        if (node._next) {
            node._next._prev = node._prev;
        }
        if (node._prev) {
            node._prev._next = node._next;
        }
        else {
            this._first = node._next;
        }

        // Destroy the node
        node.destroy();

        // Add node to pool
        if (this._pool.layoutNodes.size < MAX_POOL_SIZE) {
            this._pool.layoutNodes.size++;
            node._prev = undefined;
            node._next = this._pool.layoutNodes.first;
            this._pool.layoutNodes.first = node;
        }
    }

    getLastRenderedNodeIndex() {
        return this._contextState.nextSequence ? this._contextState.nextSequence.getIndex() : Infinity;
    }

    getFirstRenderedNodeIndex() {
        return this._contextState.prevSequence ? this._contextState.prevSequence.getIndex() : 0;
    }

    isNodeInCurrentBuild(node) {
        return !!this._nodeIdInCurrentBuild.get(node);
    }
    /**
     * Gets start layout-node for enumeration.
     *
     * @param {Bool} [next] undefined = all, true = all next, false = all previous
     * @return {LayoutNode} layout-node or undefined
     */
    getStartEnumNode(next) {
        if (next === undefined) {
            return this._first;
        }
        else if (next === true) {
            return (this._contextState.start && this._contextState.startPrev) ? this._contextState.start._next : this._contextState.start;
        }
        else if (next === false) {
            return (this._contextState.start && !this._contextState.startPrev) ? this._contextState.start._prev : this._contextState.start;
        }
    }

    /**
     * Creates or gets a layout node.
     */
    function _contextGetCreateAndOrderNodes(renderNode, prev) {

        // The first time this function is called, the current
        // prev/next position is obtained.
        var node;
        var state = this._contextState;
        if (!state.start) {
            node = this._first;
            while (node) {
                if (node.renderNode === renderNode) {
                    break;
                }
                node = node._next;
            }
            if (!node) {
                node = this.createNode(renderNode);
                node._next = this._first;
                if (this._first) {
                    this._first._prev = node;
                }
                this._first = node;
            }
            state.start = node;
            state.startPrev = prev;
            state.prev = node;
            state.next = node;
            return node;
        }

        // Check whether node already exist at the correct position
        // in the linked-list. If so, return that node immediately
        // and advance the prev/next pointer for the next/prev
        // lookup operation.
        if (prev) {
            if (state.prev._prev && (state.prev._prev.renderNode === renderNode)) {
                state.prev = state.prev._prev;
                return state.prev;
            }
        }
        else {
            if (state.next._next && (state.next._next.renderNode === renderNode)) {
                state.next = state.next._next;
                return state.next;
            }
        }

        // Lookup the node anywhere in the list..
        node = this._first;
        while (node) {
            if (node.renderNode === renderNode) {
                break;
            }
            node = node._next;
        }

        // Create new node if neccessary
        if (!node) {
            node = this.createNode(renderNode);
        }

        // Node existed, remove from linked-list
        else {
            if (node._next) {
                node._next._prev = node._prev;
            }
            if (node._prev) {
                node._prev._next = node._next;
            }
            else {
                this._first = node._next;
            }
            node._next = undefined;
            node._prev = undefined;
        }

        // Insert node into the linked list
        if (prev) {
            if (state.prev._prev) {
                node._prev = state.prev._prev;
                state.prev._prev._next = node;
            }
            else {
                this._first = node;
            }
            state.prev._prev = node;
            node._next = state.prev;
            state.prev = node;
        }
        else {
            if (state.next._next) {
                node._next = state.next._next;
                state.next._next._prev = node;
            }
            state.next._next = node;
            node._prev = state.next;
            state.next = node;
        }

        return node;
    }

    /**
     * Get the next render-node
     */
    function _contextNext() {

        // Get the next node from the sequence
        if (!this._contextState.nextSequence) {
            return undefined;
        }
        if (this._context.reverse) {
            this._contextState.nextSequence = this._contextState.nextSequence.getNext();
            if (!this._contextState.nextSequence) {
                return undefined;
            }
        }
        var renderNode = this._contextState.nextSequence.get();
        if (!renderNode) {
            this._contextState.nextSequence = undefined;
            return undefined;
        }
        var nextSequence = this._contextState.nextSequence;
        if (!this._context.reverse) {
            this._contextState.nextSequence = this._contextState.nextSequence.getNext();
        }
        if (this._contextState.lastRenderNode === renderNode) {
          throw 'ViewSequence is corrupted, should never contain the same renderNode twice, index: ' + nextSequence.getIndex();
        }
        this._contextState.lastRenderNode = renderNode;
        if(!this._contextState.firstRenderNode){
            this._contextState.firstRenderNode = renderNode;
        }
        return {
            renderNode: renderNode,
            viewSequence: nextSequence,
            next: true,
            index: ++this._contextState.nextGetIndex
        };
    }

    /**
     * Get the previous render-node
     */
    function _contextPrev() {

        // Get the previous node from the sequence
        if (!this._contextState.prevSequence) {
            return undefined;
        }
        if (!this._context.reverse) {
            this._contextState.prevSequence = this._contextState.prevSequence.getPrevious();
            if (!this._contextState.prevSequence) {
                return undefined;
            }
        }
        var renderNode = this._contextState.prevSequence.get();
        if (!renderNode) {
            this._contextState.prevSequence = undefined;
            return undefined;
        }
        var prevSequence = this._contextState.prevSequence;
        if (this._context.reverse) {
            this._contextState.prevSequence = this._contextState.prevSequence.getPrevious();
        }

        this._contextState.firstRenderNode = renderNode;
        if(!this._contextState.lastRenderNode){
            this._contextState.lastRenderNode = renderNode;
        }
        return {
            renderNode: renderNode,
            viewSequence: prevSequence,
            prev: true,
            index: --this._contextState.prevGetIndex
        };
    }

    function _setCoveredScrollHeight(coveredScrollHeight) {
        this._contextState.coveredScrollHeight = coveredScrollHeight;
    }
    /**
     * Resolve id into a context-node.
     */
    _contextGet(contextNodeOrId) {
        if (this._nodesById && ( typeof contextNodeOrId === 'string' || typeof contextNodeOrId === 'number')) {
            var renderNode = this._nodesById[contextNodeOrId];
            if (!renderNode) {
                return undefined;
            }

            // Return array
            if (renderNode instanceof Array) {
                var result = [];
                for (var i = 0, j = renderNode.length; i < j; i++) {
                    result.push({
                        renderNode: renderNode[i],
                        arrayElement: true
                    });
                }
                return result;
            }

            // Create context node
            return {
                renderNode: renderNode,
                byId: true
            };
        }
        else {
            return contextNodeOrId;
        }
    }

    /**
     * Set the node content
     */
    _contextSet(contextNodeOrId, set) {
        var contextNode = this._nodesById ? this._contextGet(contextNodeOrId) : contextNodeOrId;
        if (contextNode !== undefined) {
            /* Keeps track of which nodes that have been set */
            this._nodeIdInCurrentBuild.set(contextNode.renderNode, true);
            var node = contextNode.node;
            if (!node) {
                if (contextNode.next) {
                     if (contextNode.index < this._contextState.nextSetIndex) {
                        LayoutUtility.error('Nodes must be layed out in the same order as they were requested!');
                     }
                     this._contextState.nextSetIndex = contextNode.index;
                }
                else if (contextNode.prev) {
                     if (contextNode.index > this._contextState.prevSetIndex) {
                        LayoutUtility.error('Nodes must be layed out in the same order as they were requested!');
                     }
                     this._contextState.prevSetIndex = contextNode.index;
                }
                node = this._contextGetCreateAndOrderNodes(contextNode.renderNode, contextNode.prev);
                node._viewSequence = contextNode.viewSequence;
                node._layoutCount++;
                if (node._layoutCount === 1) {
                    this._contextState.addCount++;
                }
                contextNode.node = node;
            }
            node.usesTrueSize = contextNode.usesTrueSize;
            node.trueSizeRequested = contextNode.trueSizeRequested;
            node.set(set, this._context.size);
            if(node.renderNode === this._contextState.firstRenderNode){
                this._contextState.firstNode = node;
            }
            if(node.renderNode === this._contextState.lastRenderNode){
                this._contextState.lastNode = node;
            }
            contextNode.set = set;
        }
        return set;
    }

    /**
     * Helper function that recursively discovers the configured size for a
     * given renderNode.
     */
    function _resolveConfigSize(renderNode) {
        if (renderNode instanceof RenderNode) {
            var result = null;
            var target = renderNode.get();
            if (target) {
                result = _resolveConfigSize(target);
                if (result) {
                    return result;
                }
            }
            if (renderNode._child) {
                return _resolveConfigSize(renderNode._child);
            }
        }
        else if (renderNode instanceof Surface) {
            return renderNode.size ? {
                renderNode: renderNode,
                size: renderNode.size
            } : undefined;
        }
        else if (renderNode.options && renderNode.options.size) {
            return {
                renderNode: renderNode,
                size: renderNode.options.size
            };
        }
        return undefined;
    }

    function _moveStartSequence(next) {
        this._sequenceMovedDirection = next ? 1 : -1;
        if(next){
            this._startSequence = this._contextState.nextSequence;
        } else {
            this._startSequence = this._contextState.prevSequence;
        }
    }
        /**
     * Resolve the size of the layout-node from the renderable itsself.
     */
    function _contextResolveSize(contextNodeOrId, parentSize) {
        var contextNode = this._nodesById ? this._contextGet(contextNodeOrId) : contextNodeOrId;
        var resolveSize = this._pool.resolveSize;
        if (!contextNode) {
            resolveSize[0] = 0;
            resolveSize[1] = 0;
            return resolveSize;
        }

        // Get in use size
        var renderNode = contextNode.renderNode;
        var size = renderNode.getSize();
        if (!size) {
            return parentSize;
        }

        // Check if true-size is used and it must be reavaluated.
        // This particular piece of code specifically handles true-size Surfaces in famo.us.
        // It contains portions that ensure that the true-size of a Surface is re-evaluated
        // and also workaround code that backs up the size of a Surface, so that when the surface
        // is re-added to the DOM (e.g. when scrolling) it doesn't temporarily have a size of 0.
        var configSize = _resolveConfigSize(renderNode);
        if (configSize && ((configSize.size[0] === true) || (configSize.size[1] === true))) {
            contextNode.usesTrueSize = true;
            if (configSize.renderNode instanceof Surface) {
                var backupSize = configSize.renderNode._backupSize;
                if (configSize.renderNode._contentDirty || configSize.renderNode._trueSizeCheck) {
                  this._trueSizeRequested = true;
                  contextNode.trueSizeRequested = true;
                }
                if (configSize.renderNode._trueSizeCheck) {

                    // Fix for true-size renderables. When true-size is used, the size
                    // is incorrect for one render-cycle due to the fact that Surface.commit
                    // updates the content after asking the DOM for the offsetHeight/offsetWidth.
                    // The code below backs the size up, and re-uses that when this scenario
                    // occurs.
                    if (backupSize && (configSize.size !== size)) {
                        var newWidth = (configSize.size[0] === true) ? Math.max(backupSize[0], size[0]) : size[0];
                        var newHeight = (configSize.size[1] === true) ? Math.max(backupSize[1], size[1]) : size[1];
                        backupSize[0] = newWidth;
                        backupSize[1] = newHeight;
                        size = backupSize;
                        configSize.renderNode._backupSize = undefined;
                        backupSize = undefined;
                    }
                }
                if (this._reevalTrueSize || (backupSize && ((backupSize[0] !== size[0]) || (backupSize[1] !== size[1])))) {
                    configSize.renderNode._trueSizeCheck = true; // force request of true-size from DOM
                    configSize.renderNode._sizeDirty = true;
                    this._trueSizeRequested = true;
                }

                // Backup the size of the node
                if (!backupSize) {
                    configSize.renderNode._backupSize = [0, 0];
                    backupSize = configSize.renderNode._backupSize;
                }
                backupSize[0] = size[0];
                backupSize[1] = size[1];
            }

            // Ensure re-layout when a child layout-controller is using true-size and it
            // has ben changed.
            else if (configSize.renderNode._nodes) {
                if (this._reevalTrueSize || configSize.renderNode._nodes._trueSizeRequested) {
                    contextNode.trueSizeRequested = true;
                    this._trueSizeRequested = true;
                }
            }
        }

        // Resolve 'undefined' to parent-size and true to 0
        if ((size[0] === undefined) || (size[0] === true) || (size[1] === undefined) || (size[1] === true)) {
            resolveSize[0] = size[0];
            resolveSize[1] = size[1];
            size = resolveSize;
            if (size[0] === undefined) {
                size[0] = parentSize[0];
            }
            else if (size[0] === true) {
                size[0] = 0;
                this._trueSizeRequested = true;
                contextNode.trueSizeRequested = true;
            }
            if (size[1] === undefined) {
                size[1] = parentSize[1];
            }
            else if (size[1] === true) {
                size[1] = 0;
                this._trueSizeRequested = true;
                contextNode.trueSizeRequested = true;
            }
        }
        return size;
    }
}
