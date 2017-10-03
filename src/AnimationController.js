/* We respect the original MIT open-source license with regards to give credit to the original author Hein Rutjes.
 * any variations, changes and additions are NPOSL-3 licensed.
 * WE INTENT TO REPLACE FAMOUS-FLEX completely in the near future. As in ASAP.
 *
 * @author Hans van den Akker
 * @license NPOSL-3.0
 * @copyright Arva 2015-2017
 */

/**
 * Animating between famo.us views in awesome ways.
 *
 * @module
 */

import View from 'famous/core/View.js';
import LayoutController from './LayoutController.js';
import Transform from 'famous/core/Transform.js';
import Modifier from 'famous/core/Modifier.js';
import StateModifier from 'famous/modifiers/StateModifier.js';
import RenderNode from 'famous/core/RenderNode.js';
import Timer from 'famous/utilities/Timer.js';
import Easing from 'famous/transitions/Easing.js';


export default class AnimationController extends View {

    /**
     * @class
     * @param {Object} [options] Configurable options.
     * @param {Object} [options.transition] Transition options (default: `{duration: 400, curve: Easing.inOutQuad}`).
     * @param {Function} [options.animation] Animation function (default: `AnimationController.Animation.Slide.Left`).
     * @param {Number} [options.zIndexOffset] Optional z-index difference between the hiding & showing renderable (default: 0).
     * @param {Number} [options.keepHiddenViewsInDOMCount] Keeps views in the DOM after they have been hidden (default: 0).
     * @param {Object} [options.show] Show specific options.
     * @param {Object} [options.show.transition] Show specific transition options.
     * @param {Function} [options.show.animation] Show specific animation function.
     * @param {Object} [options.hide] Hide specific options.
     * @param {Object} [options.hide.transition] Hide specific transition options.
     * @param {Function} [options.hide.animation] Hide specific animation function.
     * @param {Object} [options.transfer] Transfer options.
     * @param {Object} [options.transfer.transition] Transfer specific transition options.
     * @param {Number} [options.transfer.zIndex] Z-index the tranferables are moved on top while animating (default: 10).
     * @param {Bool} [options.transfer.fastResize] When enabled, scales the renderable i.s.o. resizing when doing the transfer animation (default: true).
     * @param {Array} [options.transfer.items] Ids (key/value) pairs (source-id/target-id) of the renderables that should be transferred.
     * @alias module:AnimationController
     */
    constructor(options) {
      super(...arguments);

      this._size = [0, 0];
      this._createLayout();

      if (options) {
          this.setOptions(options);
      }
    }

    /**
     * Out of the box supported animations.
     */
    static Animation = {
        Slide: {
            Left: function(show, size) {
                return {transform: Transform.translate(show ? size[0] : -size[0], 0, 0)};
            },
            Right: function(show, size) {
                return {transform: Transform.translate(show ? -size[0] : size[0], 0, 0)};
            },
            Up: function(show, size) {
                return {transform: Transform.translate(0, show ? size[1] : -size[1], 0)};
            },
            Down: function(show, size) {
                return {transform: Transform.translate(0, show ? -size[1] : size[1], 0)};
            }
        },
        Fade: function(/*show, size*/) {
            return {
                opacity: (this && (this.opacity !== undefined)) ? this.opacity : 0
            };
        },
        Zoom: function(/*show, size*/) {
            var scale = (this && (this.scale !== undefined)) ? this.scale : 0.5;
            return {
                transform: Transform.scale(scale, scale, 1),
                /*
                 TODO: This doesn't work because for some reason animationcontroller treats the context as true if the size property
                 of the surface is set to true
                 align: [0.5, 0.5],
                 origin: [0.5, 0.5]*/
            };
        },
        FadedRotateZoom: function(show /*, size*/) {
            var scale = show ? ((this && (this.showScale !== undefined)) ? this.showScale : 0.9) : ((this && (this.hideScale !== undefined)) ? this.hideScale : 1.1);
            return {
                opacity: (this && (this.opacity !== undefined)) ? this.opacity : 0,
                transform: Transform.thenScale(Transform.rotateZ(48*Math.PI/scale),[scale, scale, 1]),
                origin: [0.5, 0.5],
                align: [0.5, 0.5]
            };
        },
        FadedZoom: function(show /*, size*/) {
            var scale = show ? ((this && (this.showScale !== undefined)) ? this.showScale : 0.9) : ((this && (this.hideScale !== undefined)) ? this.hideScale : 1.1);
            return {
                opacity: (this && (this.opacity !== undefined)) ? this.opacity : 0,
                transform: Transform.scale(scale, scale, 1),
                /*align: [0.5, 0.5],
                 origin: [0.5, 0.5]*/
            };
        }
    }

    static DEFAULT_OPTIONS = {
        transition: {duration: 400, curve: Easing.inOutQuad},
        animation: AnimationController.Animation.Fade,
        show: {
            // transition,
            // animation
        },
        hide: {
            // transition,
            // animation
        },
        transfer: {
            fastResize: true,
            zIndex: 10 // z-index offset the items are translated while transferring
            // transition,
            // items: {
            //   'image': 'image'
            //   'image': ['image', 'image2']
            // }
        },
        zIndexOffset: 0,
        keepHiddenViewsInDOMCount: 0
    }

    static ItemState = {
        NONE: 0,
        HIDE: 1,
        HIDING: 2,
        HIDDEN: 3,
        SHOW: 4,
        SHOWING: 5,
        VISIBLE: 6,
        QUEUED: 7
    }

    /**
     * Stacks the renderables on top of each other
     * with a z-translation of this.options.zIndexOffset.
     */
    ViewStackLayout(context, options) {
        var set = {
            size: context.size,
            translate: [0, 0, 0]
        };
        this._size[0] = context.size[0];
        this._size[1] = context.size[1];
        var views = context.get('views');
        var transferables = context.get('transferables');
        var visibleCount = 0;
        for (var i = 0; i < views.length; i++) {
            var item = this._viewStack[i];
            switch (item.state) {
                case ItemState.HIDDEN:
                    context.set(views[i], {
                        size: context.size,
                        translate: [context.size[0] * 2, context.size[1] * 2, 0]
                    });
                    break;

                case ItemState.HIDE:
                case ItemState.HIDING:
                case ItemState.VISIBLE:
                case ItemState.SHOW:
                case ItemState.SHOWING:
                    if (visibleCount < 2) {
                        visibleCount++;

                        // Layout view
                        var view = views[i];
                        context.set(view, set);

                        // Layout any transferables
                        for (var j = 0; j < transferables.length; j++) {
                            for (var k = 0; k < item.transferables.length; k++) {
                                if (transferables[j].renderNode === item.transferables[k].renderNode) {
                                    context.set(transferables[j], {
                                        translate: [0, 0, set.translate[2]],
                                        size: [context.size[0], context.size[1]]
                                    });
                                }
                            }
                        }

                        // Increase z-index for next view
                        set.translate[2] += options.zIndexOffset;
                    }
                    break;
            }
        }
    }

    /**
     * Creates the view-stack layout.
     */
    _createLayout() {
        this._renderables = {
            views: [],
            transferables: []
        };
        this._viewStack = [];
        this.layout = new LayoutController({
            layout: this.ViewStackLayout,
            layoutOptions: this.options,
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.on('layoutend', this._processAnimations);
    }

    /**
     * Gets the spec from a spec.
     */
    _getViewSpec(item, view, id, callback) {
        if (!item.view) {
            return;
        }
        var spec = view.getSpec(id);
        if (spec && !spec.trueSizeRequested) {
            callback(spec);
        }
        else {
            Timer.after(_getViewSpec.bind(this, item, view, id, callback), 1);
        }
    }

    /**
     * Gets the transferable delegate for the given id.
     */
    _getTransferable(item, view, id) {
        // 1. If view supports getTransferable, use that
        if (view.getTransferable) {
            return view.getTransferable(id);
        }
        // 2. If view is derived from layoutcontroller, use that
        if (view.getSpec && view.get && view.replace) {
            if (view.get(id) !== undefined) {
                return {
                    get: function() {
                        return view.get(id);
                    },
                    show: function(renderable) {
                        view.replace(id, renderable);
                    },
                    getSpec: _getViewSpec.bind(this, item, view, id)
                };
            }
        }
        // 3. If view has an embedded layout, use that as fallback
        if (view.layout) {
            return this._getTransferable(item, view.layout, id);
        }
    }

    /**
     * Begins visual transfer or renderables from the previous item
     * to the new item.
     */
    _initTransferableAnimations(item, prevItem, callback) {
        var callbackCount = 0;
        function waitForAll() {
            callbackCount--;
            if (callbackCount === 0) {
                callback();
            }
        }
        for (var sourceId in item.options.transfer.items) {
            if (this._initTransferableAnimation(item, prevItem, sourceId, waitForAll)) {
                callbackCount++;
            }
        }
        if (!callbackCount) {
            callback();
        }
    }

    _initTransferableAnimation(item, prevItem, sourceId, callback) {
        var target = item.options.transfer.items[sourceId];
        var transferable = {};
        transferable.source = this._getTransferable(prevItem, prevItem.view, sourceId);
        if (Array.isArray(target)) {
            for (var i = 0; i < target.length; i++) {
                transferable.target = this._getTransferable(item, item.view, target[i]);
                if (transferable.target) {
                    break;
                }
            }
        }
        else {
            transferable.target = this._getTransferable(item, item.view, target);
        }
        if (transferable.source && transferable.target) {
            transferable.source.getSpec(function(sourceSpec) {

                // Replace source & target renderables in the views
                // source: dummy-node
                // target: target-renderable with opacity: 0.
                transferable.sourceSpec = sourceSpec;
                transferable.originalSource = transferable.source.get();
                transferable.source.show(new RenderNode(new Modifier(sourceSpec)));
                transferable.originalTarget = transferable.target.get();
                var targetNode = new RenderNode(new Modifier({opacity: 0}));
                targetNode.add(transferable.originalTarget);
                transferable.target.show(targetNode);

                // Take ownership of the source renderable.
                // This renderable will be layouted by the layout-function
                var zIndexMod = new Modifier({
                    transform: Transform.translate(0, 0, item.options.transfer.zIndex)
                });
                transferable.mod = new StateModifier(sourceSpec);
                transferable.renderNode = new RenderNode(zIndexMod);
                transferable.renderNode.add(transferable.mod).add(transferable.originalSource);
                item.transferables.push(transferable);
                this._renderables.transferables.push(transferable.renderNode);
                this.layout.reflowLayout();

                // Wait for the target spec to have settled. This may take a couple render
                // cycles if for instance, this involves a true-size renderable or the
                // renderable is affected by other true-size renderables around itsself.
                Timer.after(function() {
                    var callbackCalled;
                    transferable.target.getSpec(function(targetSpec, transition) {
                        transferable.targetSpec = targetSpec;
                        transferable.transition = transition;
                        if (!callbackCalled) {
                            callback();
                        }
                    }, true);
                }, 1);
            }.bind(this), false);
            return true;
        }
        else {
            return false;
        }
    }

    _startTransferableAnimations(item, callback) {
        for (var j = 0; j < item.transferables.length; j++) {
            var transferable = item.transferables[j];
            transferable.mod.halt();
            if ((transferable.sourceSpec.opacity !== undefined) || (transferable.targetSpec.opacity !== undefined)) {
                transferable.mod.setOpacity((transferable.targetSpec.opacity === undefined) ? 1 : transferable.targetSpec.opacity, transferable.transition || item.options.transfer.transition);
            }
            if (item.options.transfer.fastResize) {
                if (transferable.sourceSpec.transform || transferable.targetSpec.transform || transferable.sourceSpec.size || transferable.targetSpec.size) {
                    var transform = transferable.targetSpec.transform || Transform.identity;
                    if (transferable.sourceSpec.size && transferable.targetSpec.size) {
                        transform = Transform.multiply(transform, Transform.scale(transferable.targetSpec.size[0] / transferable.sourceSpec.size[0], transferable.targetSpec.size[1] / transferable.sourceSpec.size[1], 1));
                    }
                    transferable.mod.setTransform(transform, transferable.transition || item.options.transfer.transition, callback);
                    callback = undefined;
                }
            }
            else {
                if (transferable.sourceSpec.transform || transferable.targetSpec.transform) {
                    transferable.mod.setTransform(transferable.targetSpec.transform || Transform.identity, transferable.transition || item.options.transfer.transition, callback);
                    callback = undefined;
                }
                if (transferable.sourceSpec.size || transferable.targetSpec.size) {
                    transferable.mod.setSize(transferable.targetSpec.size || transferable.sourceSpec.size, transferable.transition || item.options.transfer.transition, callback);
                    callback = undefined;
                }
            }
        }
        if (callback) {
            callback();
        }
    }

    /**
     * Called whenever the view has been shown and the
     * transferable animations should be ended. This returns
     * the renderables to their original views.
     */
    _endTransferableAnimations(item) {
        for (var j = 0; j < item.transferables.length; j++) {
            var transferable = item.transferables[j];
            for (var i = 0; i < this._renderables.transferables.length; i++) {
                if (this._renderables.transferables[i] === transferable.renderNode) {
                    this._renderables.transferables.splice(i, 1);
                    break;
                }
            }
            transferable.source.show(transferable.originalSource);
            transferable.target.show(transferable.originalTarget);
        }
        item.transferables = [];
        this.layout.reflowLayout();
    }

    /**
     * Starts a show or hide animation.
     */
    function _processAnimations(event) {
        var prevItem;
        for (var i = 0; i < this._viewStack.length; i++) {
            var item = this._viewStack[i];
            switch (item.state) {
                case ItemState.HIDE:
                    item.state = ItemState.HIDING;
                    this._initHideAnimation(item, prevItem, event.size);
                    this._updateState();
                    break;
                case ItemState.SHOW:
                    item.state = ItemState.SHOWING;
                    this._initShowAnimation(item, prevItem, event.size);
                    this._updateState();
                    break;
            }
            prevItem = item;
        }
    }

    /**
     * Starts the view animation.
     */
    _initShowAnimation(item, prevItem, size) {
        var spec = item.options.show.animation ? item.options.show.animation.call(undefined, true, size) : {};
        item.startSpec = spec;
        item.endSpec = {
            opacity: 1,
            transform: Transform.identity
        };
        item.mod.halt();
        if (spec.transform) {
            item.mod.setTransform(spec.transform);
        }
        if (spec.opacity !== undefined) {
            item.mod.setOpacity(spec.opacity);
        }
        if (spec.align) {
            item.mod.setAlign(spec.align);
        }
        if (spec.origin) {
            item.mod.setOrigin(spec.origin);
        }
        var startShowAnimation = _startShowAnimation.bind(this, item, spec);
        var waitAndShow = item.wait ? function() {
            item.wait.then(startShowAnimation, startShowAnimation);
        } : startShowAnimation;
        if (prevItem) {
            this._initTransferableAnimations(item, prevItem, waitAndShow);
        }
        else {
            waitAndShow();
        }
    }

    /**
     * Starts the show animation whenever init has completed.
     */
    _startShowAnimation(item, spec) {
        if (!item.halted) {
            var callback = item.showCallback;
            if (spec.transform) {
                item.mod.setTransform(Transform.identity, item.options.show.transition, callback);
                callback = undefined;
            }
            if (spec.opacity !== undefined) {
                item.mod.setOpacity(1, item.options.show.transition, callback);
                callback = undefined;
            }
            this._startTransferableAnimations(item, callback);
        }
    }

    /**
     * Helper function for interpolating between start/end state based on percentage.
     */
    static _interpolate(start, end, perc) {
        return start + ((end - start) * perc);
    }

    /**
     * Halts a item at a given frame. The frame is provided as a percentage
     * of the whole transition.
     */
    static _haltItemAtFrame(item, perc) {
        item.mod.halt();
        item.halted = true;
        if (item.startSpec && (perc !== undefined)) {
            if ((item.startSpec.opacity !== undefined) && (item.endSpec.opacity !== undefined)) {
                item.mod.setOpacity(_interpolate(item.startSpec.opacity, item.endSpec.opacity, perc));
            }
            if (item.startSpec.transform && item.endSpec.transform) {
                var transform = [];
                for (var i = 0; i < item.startSpec.transform.length; i++) {
                    transform.push(_interpolate(item.startSpec.transform[i], item.endSpec.transform[i], perc));
                }
                item.mod.setTransform(transform);
            }
        }
    }

    /**
     * Waits for the animation to start.
     */
    _initHideAnimation(item, prevItem, size) {
        var startHideAnimation = _startHideAnimation.bind(this, item, prevItem, size);
        if (item.wait) {
            item.wait.then(startHideAnimation, startHideAnimation);
        }
        else {
            startHideAnimation();
        }
    }

    /**
     * Starts the hide animation.
     */
    static _startHideAnimation(item, prevItem, size) {
        var spec = item.options.hide.animation ? item.options.hide.animation.call(undefined, false, size) : {};
        item.endSpec = spec;
        item.startSpec = {
            opacity: 1,
            transform: Transform.identity
        };
        if (!item.halted) {
            item.mod.halt();
            var callback = item.hideCallback;
            if (spec.transform) {
                item.mod.setTransform(spec.transform, item.options.hide.transition, callback);
                callback = undefined;
            }
            if (spec.opacity !== undefined) {
                item.mod.setOpacity(spec.opacity, item.options.hide.transition, callback);
                callback = undefined;
            }
            if (callback) {
                callback();
            }
        }
    }

    /**
     * Sets the options for an item.
     */
    _setItemOptions(item, options, callback) {
        item.options = {
            show: {
                transition: this.options.show.transition || this.options.transition,
                animation: this.options.show.animation || this.options.animation
            },
            hide: {
                transition: this.options.hide.transition || this.options.transition,
                animation: this.options.hide.animation || this.options.animation
            },
            transfer: {
                transition: this.options.transfer.transition || this.options.transition,
                items: this.options.transfer.items || {},
                zIndex: this.options.transfer.zIndex,
                fastResize: this.options.transfer.fastResize
            }
        };
        if (options) {
            item.options.show.transition = (options.show ? options.show.transition : undefined) || options.transition || item.options.show.transition;
            if (options && options.show && (options.show.animation !== undefined)) {
                item.options.show.animation = options.show.animation;
            }
            else if (options && (options.animation !== undefined)) {
                item.options.show.animation = options.animation;
            }
            item.options.transfer.transition = (options.transfer ? options.transfer.transition : undefined) || options.transition || item.options.transfer.transition;
            item.options.transfer.items = (options.transfer ? options.transfer.items : undefined) || item.options.transfer.items;
            item.options.transfer.zIndex = (options.transfer && (options.transfer.zIndex !== undefined)) ? options.transfer.zIndex : item.options.transfer.zIndex;
            item.options.transfer.fastResize = (options.transfer && (options.transfer.fastResize !== undefined)) ? options.transfer.fastResize : item.options.transfer.fastResize;
        }
        item.showCallback = () => {
            item.showCallback = undefined;
            item.state = ItemState.VISIBLE;
            this._updateState();
            this._endTransferableAnimations(item);
            item.endSpec = undefined;
            item.startSpec = undefined;
            if (callback) {
                callback();
            }
        };
    }

    /**
     * Updates the state.
     */
    _updateState() {
      var prevItem;
      var invalidated = false;
      var hiddenViewCount = 0;
      var i = 0;
      while (i < this._viewStack.length) {
          if (this._viewStack[i].state === ItemState.HIDDEN) {
              hiddenViewCount++;
              for (var j = 0; j < this._viewStack.length; j++) {
                  if ((this._viewStack[j].state !== ItemState.HIDDEN) &&
                      (this._viewStack[j].view === this._viewStack[i].view)) {
                      this._viewStack[i].view = undefined;
                      this._renderables.views.splice(i, 1);
                      this._viewStack.splice(i, 1);
                      i--;
                      hiddenViewCount--;
                      break;
                  }
              }
          }
          i++;
      }
      while (hiddenViewCount > this.options.keepHiddenViewsInDOMCount) {
          this._viewStack[0].view = undefined;
          this._renderables.views.splice(0, 1);
          this._viewStack.splice(0, 1);
          hiddenViewCount--;
      }
      for (i = hiddenViewCount; i < (Math.min(this._viewStack.length - hiddenViewCount, 2) + hiddenViewCount); i++) {
          var item = this._viewStack[i];
          if (item.state === ItemState.QUEUED) {
              if (!prevItem ||
                  (prevItem.state === ItemState.VISIBLE) ||
                  (prevItem.state === ItemState.HIDING)) {
                  if (prevItem && (prevItem.state === ItemState.VISIBLE)) {
                      prevItem.state = ItemState.HIDE;
                      prevItem.wait = item.wait;
                  }
                  item.state = ItemState.SHOW;
                  invalidated = true;
              }
              break;
          }
          else if ((item.state === ItemState.VISIBLE) && item.hide) {
              item.state = ItemState.HIDE;
          }
          if ((item.state === ItemState.SHOW) || (item.state === ItemState.HIDE)) {
              this.layout.reflowLayout();
          }
          prevItem = item;
      }
      if (invalidated) {
          this._updateState();
          this.layout.reflowLayout();
      }
    }

    _resume() {
      for (var i = 0; i < Math.min(this._viewStack.length, 2); i++) {
          var item = this._viewStack[i];
          if (item.halted) {
              item.halted = false;
              if (item.endSpec) {
                  var callback;
                  switch (item.state) {
                      case ItemState.HIDE:
                      case ItemState.HIDING:
                          callback = item.hideCallback;
                          break;
                      case ItemState.SHOW:
                      case ItemState.SHOWING:
                          callback = item.showCallback;
                          break;
                  }
                  item.mod.halt();
                  if (item.endSpec.transform) {
                      item.mod.setTransform(item.endSpec.transform, item.options.show.transition, callback);
                      callback = undefined;
                  }
                  if (item.endSpec.opacity !== undefined) {
                      item.mod.setOpacity(item.endSpec.opacity, item.options.show.transition, callback);
                  }
                  if (callback) {
                      callback();
                  }
              }
          }
      }
    }

    /**
     * Shows a renderable using an animation and hides the old renderable.
     *
     * When multiple show operations are executed, they are queued and
     * shown in that sequence. Use `.halt` to cancel any pending show
     * operations from the queue.
     *
     * @param {Renderable} renderable View or surface to show
     * @param {Object} [options] Options.
     * @param {Object} [options.transition] Transition options for both show & hide.
     * @param {Function} [options.animation] Animation function for both show & hide.
     * @param {Promise} [options.wait] A promise to wait for before running the animation.
     * @param {Object} [options.show] Show specific options.
     * @param {Object} [options.show.transition] Show specific transition options.
     * @param {Function} [options.show.animation] Show specific animation function.
     * @param {Object} [options.hide] Hide specific options.
     * @param {Object} [options.hide.transition] Hide specific transition options.
     * @param {Function} [options.hide.animation] Hide specific animation function.
     * @param {Object} [options.transfer] Transfer options.
     * @param {Object} [options.transfer.transition] Transfer specific transition options.
     * @param {Number} [options.transfer.zIndex] Z-index the tranferables are moved on top while animating.
     * @param {Array} [options.transfer.items] Ids (key/value) pairs (source-id/target-id) of the renderables that should be transferred.
     * @param {Function} [callback] Function that is called on completion.
     * @return {AnimationController} this
     */
    show(renderable, options, callback) {
        this._resume(renderable);
        if (!renderable) {
            return this.hide(options, callback);
        }
        var item = this._viewStack.length ? this._viewStack[this._viewStack.length - 1] : undefined;
        if (item && (item.view === renderable) && (item.state !== ItemState.HIDDEN)) {
            item.hide = false;
            if (item.state === ItemState.HIDE) {
                item.state = ItemState.QUEUED;
                this._setItemOptions(item, options, callback);
                this._updateState();
            }
            else if (item.state === ItemState.HIDING) {
                this.abort(callback);
            }
            else if (callback) {
                callback();
            }
            return this;
        }
        if (item && (item.state !== ItemState.HIDING) && options) {
            item.options.hide.transition = (options.hide ? options.hide.transition : undefined) || options.transition || item.options.hide.transition;
            if (options && options.hide && (options.hide.animation !== undefined)) {
                item.options.hide.animation = options.hide.animation;
            }
            else if (options && (options.animation !== undefined)) {
                item.options.hide.animation = options.animation;
            }
        }
        item = {
            view: renderable,
            mod: new StateModifier(),
            state: ItemState.QUEUED,
            callback: callback,
            transferables: [], // renderables currently being transfered
            wait: options ? options.wait : undefined
        };
        item.node = new RenderNode(item.mod);
        item.node.add(renderable);
        this._setItemOptions(item, options, callback);
        item.hideCallback = () => {
            item.hideCallback = undefined;
            item.state = ItemState.HIDDEN;
            this._updateState();
            this.layout.reflowLayout();
        };
        this._renderables.views.push(item.node);
        this._viewStack.push(item);
        this._updateState();
        return this;
    }

    /**
     * Hides the current view with an animation.
     *
     * @param {Object} [options] Hide options
     * @param {Object} [options.transition] Hide transition options.
     * @param {Function} [options.animation] Hide animation function.
     * @param {Function} [callback] Function that is called an completion.
     * @return {AnimationController} this
     */
    hide(options, callback) {
        this._resume();
        var item = this._viewStack.length ? this._viewStack[this._viewStack.length - 1] : undefined;
        if (!item || (item.state === ItemState.HIDING)) {
            return this;
        }
        item.hide = true;
        if (options) {
            item.options.hide.transition = (options.hide ? options.hide.transition : undefined) || options.transition || item.options.hide.transition;
            if (options && options.hide && (options.hide.animation !== undefined)) {
                item.options.hide.animation = options.hide.animation;
            }
            else if (options && (options.animation !== undefined)) {
                item.options.hide.animation = options.animation;
            }
        }
        item.hideCallback = () => {
            item.hideCallback = undefined;
            item.state = ItemState.HIDDEN;
            this._updateState();
            this.layout.reflowLayout();
            if (callback) {
                callback();
            }
        };
        this._updateState();
        return this;
    }

    /**
     * Clears the queue of any pending show animations.
     *
     * @param {Boolean} [stopAnimation] Freezes the current animation.
     * @param {Number} [framePerc] Frame at which to freeze the animation (in percentage).
     * @return {AnimationController} this
     */
    halt(stopAnimation, framePerc) {
      var item;
      for (var i = 0; i < this._viewStack.length; i++) {
          if (stopAnimation) {
              item = this._viewStack[i];
              switch (item.state) {
                  case ItemState.SHOW:
                  case ItemState.SHOWING:
                  case ItemState.HIDE:
                  case ItemState.HIDING:
                  case ItemState.VISIBLE:
                      _haltItemAtFrame(item, framePerc);
                      break;
              }
          }
          else {
              item = this._viewStack[this._viewStack.length - 1];
              if ((item.state === ItemState.QUEUED) || (item.state === ItemState.SHOW)) {
                  this._renderables.views.splice(this._viewStack.length - 1, 1);
                  this._viewStack.splice(this._viewStack.length - 1, 1);
                  item.view = undefined;
              }
              else {
                  break;
              }
          }
      }
      return this;
    }

    /**
     * Aborts the currently active show or hide operation, effectively
     * reversing the animation.
     *
     * @param {Function} [callback] Function that is called on completion.
     * @return {AnimationController} this
     */
    abort(callback) {
      var item;
      if ((this._viewStack.length >= 2) && (this._viewStack[0].state === ItemState.HIDING) && (this._viewStack[1].state === ItemState.SHOWING)) {
          var prevItem = this._viewStack[0];
          item = this._viewStack[1];
          var swapSpec;

          item.halted = true;
          swapSpec = item.endSpec;
          item.endSpec = item.startSpec;
          item.startSpec = swapSpec;
          item.state = ItemState.HIDING;
          item.hideCallback = () => {
              item.hideCallback = undefined;
              item.state = ItemState.HIDDEN;
              this._updateState();
              this.layout.reflowLayout();
          };

          prevItem.halted = true;
          swapSpec = prevItem.endSpec;
          prevItem.endSpec = prevItem.startSpec;
          prevItem.startSpec = swapSpec;
          prevItem.state = ItemState.SHOWING;
          prevItem.showCallback = () => {
              prevItem.showCallback = undefined;
              prevItem.state = ItemState.VISIBLE;
              this._updateState();
              this._endTransferableAnimations(prevItem);
              prevItem.endSpec = undefined;
              prevItem.startSpec = undefined;
              if (callback) {
                  callback();
              }
          };

          this._resume();
      }
      else if ((this._viewStack.length === 1) && (this._viewStack[0].state === ItemState.HIDING)) {
          item = this._viewStack[0];
          item.halted = true;
          swapSpec = item.endSpec;
          item.endSpec = item.startSpec;
          item.startSpec = swapSpec;
          item.state = ItemState.SHOWING;
          item.showCallback = () => {
              item.showCallback = undefined;
              item.state = ItemState.VISIBLE;
              this._updateState();
              this._endTransferableAnimations(item);
              item.endSpec = undefined;
              item.startSpec = undefined;
              if (callback) {
                  callback();
              }
          };

          this._resume();
      }
      return this;
    }

    /**
     * Gets the currently visible or being shown renderable.
     *
     * @return {Renderable} currently visible view/surface
     */
    get() {
      for (var i = 0; i < this._viewStack.length; i++) {
          var item = this._viewStack[i];
          if ((item.state === ItemState.VISIBLE) ||
              (item.state === ItemState.SHOW) ||
              (item.state === ItemState.SHOWING)) {
              return item.view;
          }
      }
      return undefined;
    }

    /**
     * Gets the size of the view.
     *
     * @return {Array.Number} size
     */
    getSize() {
      return this._size || this.options.size;
    }
}
