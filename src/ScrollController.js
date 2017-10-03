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
 * Scrollable layout-controller.
 *
 * Key features:
 * -    Customizable layout
 * -    Insert/remove renderables into the scene using animations/spec
 * -    Support for `true` size renderables
 * -    Horizontal/vertical direction
 * -    Top/left or bottom/right alignment
 * -    Pagination
 * -    Option to embed in a ContainerSurface
 *
 * Events:
 *
 * |event      |description|
 * |-----------|-----------|
 * |scrollstart|Emitted when scrolling starts.|
 * |scroll     |Emitted as the content scrolls (once for each frame the visible offset has changed).|
 * |pagechange |Emitted whenever the visible page changes.|
 * |scrollend  |Emitted after scrolling stops (when the scroll particle settles).|
 *
 * Inherited from: [LayoutController](./LayoutController.md)
 * @module
 */

import LayoutUtility from './LayoutUtility.js';
import LayoutController from './LayoutController.js';
import LayoutNode from './LayoutNode.js';
import FlowLayoutNode from './FlowLayoutNode.js';
import LayoutNodeManager from './LayoutNodeManager.js';
import ContainerSurface from 'famous/surfaces/ContainerSurface.js';
import Transform from 'famous/core/Transform.js';
import EventHandler from 'famous/core/EventHandler.js';
import Group from 'famous/core/Group.js';
import Engine from 'famous/core/Engine.js';
import NativeScrollGroup from 'famous/core/NativeScrollGroup.js';
import Vector from 'famous/math/Vector.js';
import PhysicsEngine from 'famous/physics/PhysicsEngine.js';
import Particle from 'famous/physics/bodies/Particle.js';
import Drag from 'famous/physics/forces/Drag.js';
import Spring from 'famous/physics/forces/Spring.js';
import ScrollSync from 'famous/inputs/ScrollSync.js';
import LinkedListViewSequence from './LinkedListViewSequence.js';

export default class ScrollController extends LayoutController {

    /**
     * Boudary reached detection
     */
    static Bounds = {
        NONE: 0,
        PREV: 1, // top
        NEXT: 2, // bottom
        BOTH: 3
    }

    /**
     * Source of the spring
     */
    static SpringSource = {
        NONE: 'none',
        NEXTBOUNDS: 'next-bounds', // top
        PREVBOUNDS: 'prev-bounds', // bottom
        MINSIZE: 'minimal-size',
        GOTOSEQUENCE: 'goto-sequence',
        ENSUREVISIBLE: 'ensure-visible',
        GOTOPREVDIRECTION: 'goto-prev-direction',
        GOTONEXTDIRECTION: 'goto-next-direction'
    }

    /**
     * Pagination modes
     */
    static PaginationMode = {
        PAGE: 0,
        SCROLL: 1
    }

    /**
     * @class
     * @extends LayoutController
     * @param {Object} options Configurable options (see LayoutController for all inherited options).
     * @param {Bool} [options.useContainer] Embeds the view in a ContainerSurface to hide any overflow and capture input events (default: `false`).
     * @param {String} [options.container] Options that are passed to the ContainerSurface in case `useContainer` is true.
     * @param {Bool} [options.paginated] Enabled pagination when set to `true` (default: `false`).
     * @param {Number} [options.paginationEnergyThreshold] Threshold after which pagination kicks in (default: `0.01`).
     * @param {PaginationMode} [options.paginationMode] Pagination-mode (either page-based or scroll-based) (default: `PaginationMode.PAGE`).
     * @param {Number} [options.alignment] Alignment of the renderables (0 = top/left, 1 = bottom/right) (default: `0`).
     * @param {Bool} [options.mouseMove] Enables scrolling by holding the mouse-button down and moving the mouse (default: `false`).
     * @param {Bool} [options.enabled] Enables or disabled user input (default: `true`).
     * @param {Bool} [options.overscroll] Enables or disables overscroll (default: `true`).
     * @param {Object} [options.scrollParticle] Options for the scroll particle (default: `{}`)
     * @param {Object} [options.scrollSpring] Spring-force options that are applied on the scroll particle when e.g. bounds is reached (default: `{dampingRatio: 1.0, period: 350}`)
     * @param {Object} [options.scrollDrag] Drag-force options to apply on the scroll particle
     * @param {Object} [options.scrollFriction] Friction-force options to apply on the scroll particle
     * @param {Bool} [options.layoutAll] When set to true, always lays out all renderables in the datasource (default: `false`).
     * @alias module:ScrollController
     */
    constructor(options) {
        super(options, LayoutManager);
        options = LayoutUtility.combineOptions(ScrollController.DEFAULT_OPTIONS, options);
        var layoutManager = new LayoutNodeManager(options.flow ? FlowLayoutNode : LayoutNode, this._initLayoutNode);

        // Scrolling
        this._scroll = {
            activeTouches: [],
            // physics-engine to use for scrolling
            pe: new PhysicsEngine(this.options.scrollPhysicsEngine),
            // particle that represents the scroll-offset
            particle: new Particle(this.options.scrollParticle),
            // drag-force that slows the particle down after a "flick"
            dragForce: new Drag(this.options.scrollDrag),
            frictionForce: new Drag(this.options.scrollFriction),
            // spring
            springValue: undefined,
            springForce: new Spring(this.options.scrollSpring),
            springEndState: new Vector([0, 0, 0]),
            // group
            groupStart: 0,
            groupTranslate: [0, 0, 0],
            // delta
            scrollDelta: 0,
            normalizedScrollDelta: 0,
            scrollForce: 0,
            scrollForceCount: 0,
            unnormalizedScrollOffset: 0,
            // state
            isScrolling: false
        };

        // Diagnostics
        this._debug = {
            layoutCount: 0,
            commitCount: 0
        };
        if(options.nativeScroll){

            // Create group for faster rendering
            this.group = new NativeScrollGroup();
            Engine.enableTouchMove();
            this.options.enabled = false;
            this.options.layoutAll = false;
        } else {
            // Create group for faster rendering
            this.group = new Group();
        }
        this.group.add({render: this._innerRender});

        // Configure physics engine with particle and drag
        this._scroll.pe.addBody(this._scroll.particle);
        if (!this.options.scrollDrag.disabled) {
            this._scroll.dragForceId = this._scroll.pe.attach(this._scroll.dragForce, this._scroll.particle);
        }
        if (!this.options.scrollFriction.disabled) {
            this._scroll.frictionForceId = this._scroll.pe.attach(this._scroll.frictionForce, this._scroll.particle);
        }
        this._scroll.springForce.setOptions({ anchor: this._scroll.springEndState });
        if(!options.nativeScroll){
            // Listen to touch events
            this._eventInput.on('touchstart', this._touchStart, {axis: this._direction});
            this._eventInput.on('touchmove', this._touchMove, {axis: this._direction});
            this._eventInput.on('touchend',this. _touchEnd, {axis: this._direction});
            this._eventInput.on('touchcancel', this._touchEnd, {axis: this._direction});

            // Listen to mouse-move events
            this._eventInput.on('mousedown', this._mouseDown);
            this._eventInput.on('mouseup', this._mouseUp);
            this._eventInput.on('mousemove',this. _mouseMove);
            // Listen to mouse-wheel events
            this._scrollSync = new ScrollSync(this.options.scrollSync);
            this._eventInput.pipe(this._scrollSync);
            this._scrollSync.on('update', this._scrollUpdate);
        }



        // Embed in container surface if neccesary
        if (this.options.useContainer) {
            this.container = new ContainerSurface(this.options.container);

            // Create container surface, which has one child, which just returns
            // the entity-id of this scrollview. This causes the Commit function
            // of this scrollview to be called
            this.container.add({
                render: () => {
                    return this.id;
                }
            });

            // Pipe events received in container to this scrollview
            if (!this.options.autoPipeEvents) {
                this.subscribe(this.container);
                EventHandler.setInputHandler(this.container, this);
                EventHandler.setOutputHandler(this.container, this);
            } else {
                this.container.pipe(this);
            }
        }
    }



    static DEFAULT_OPTIONS = {
        useContainer: false,    // when true embeds inside a ContainerSurface for capturing input events & clipping
        container: {
            properties: {
                overflow: 'hidden' // overflow mode when useContainer is enabled
            }
        },
        scrollPhysicsEngine: {
            // use defaults
            //velocityCap: undefined,
            //angularVelocityCap: undefined
        },
        scrollParticle: {
            // use defaults
            //mass: 1
        },
        scrollDrag: {
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: 0.001,
            disabled: true
        },
        scrollFriction: {
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: 0.0025,
            disabled: false
        },
        scrollSpring: {
            dampingRatio: 1.0,
            period: 350
        },
        scrollSync: {
            scale: 0.2,
            preventDefault: false
        },
        overscroll: true,
        paginated: false,
        paginationMode: PaginationMode.PAGE,
        paginationEnergyThreshold: 0.01,
        alignment: 0,         // [0: top/left, 1: bottom/right]
        touchMoveDirectionThreshold: undefined, // 0..1
        touchMoveNoVelocityDuration: 100,
        mouseMove: false,
        scrollWheelForces: false,
        scrollWheelForceStep: 120,
        enabled: true,          // set to false to disable scrolling
        layoutAll: false,       // set to true is you want all renderables layed out/rendered
        alwaysLayout: false,    // set to true to always call the layout function
        extraBoundsSpace: [100, 100],
        debug: false
    }

    /**
     * Patches the ScrollController instance's options with the passed-in ones.
     *
     * @param {Object} options Configurable options (see LayoutController for all inherited options).
     * @param {Bool} [options.paginated] Enabled pagination when set to `true` (default: `false`).
     * @param {Number} [options.paginationEnergyThreshold] Threshold after which pagination kicks in (default: `0.01`).
     * @param {PaginationMode} [options.paginationMode] Pagination-mode (either page-based or scroll-based) (default: `PaginationMode.PAGE`).
     * @param {Number} [options.alignment] Alignment of the renderables (0 = top/left, 1 = bottom/right) (default: `0`).
     * @param {Bool} [options.mouseMove] Enables scrolling by holding the mouse-button down and moving the mouse (default: `false`).
     * @param {Bool} [options.enabled] Enables or disables user input (default: `true`).
     * @param {Bool} [options.overscroll] Enables or disables overscroll (default: `true`).
     * @param {Object} [options.scrollParticle] Options for the scroll particle (default: `{}`)
     * @param {Object} [options.scrollSpring] Spring-force options that are applied on the scroll particle when e.g. bounds is reached (default: `{dampingRatio: 1.0, period: 500}`)
     * @param {Object} [options.scrollDrag] Drag-force options to apply on the scroll particle
     * @param {Object} [options.scrollFriction] Friction-force options to apply on the scroll particle
     * @param {Bool} [options.layoutAll] When set to true, always lays out all renderables in the datasource (default: `false`).
     * @return {ScrollController} this
     */
    setOptions(options) {
        super.setOptions(options);

        if (options.hasOwnProperty('paginationEnergyThresshold')) {
            console.warn('option `paginationEnergyThresshold` has been deprecated, please rename to `paginationEnergyThreshold`.');
            this.setOptions({
                paginationEnergyThreshold: options.paginationEnergyThresshold
            });
        }
        if (options.hasOwnProperty('touchMoveDirectionThresshold')) {
            console.warn('option `touchMoveDirectionThresshold` has been deprecated, please rename to `touchMoveDirectionThreshold`.');
            this.setOptions({
                touchMoveDirectionThreshold: options.touchMoveDirectionThresshold
            });
        }
        if (this._scroll) {
            if (options.scrollSpring) {
                this._scroll.springForce.setOptions(options.scrollSpring);
            }
            if (options.scrollDrag) {
                this._scroll.dragForce.setOptions(options.scrollDrag);
            }
        }
        if (options.scrollSync && this._scrollSync) {
            this._scrollSync.setOptions(options.scrollSync);
        }
        return this;
    }

    /**
     * Called whenever a layout-node is created/re-used. Initializes
     * the node with the `insertSpec` if it has been defined and enabled
     * locking of the x/y translation so that the x/y position of the renderable
     * is immediately updated when the user scrolls the view.
     */
    _initLayoutNode(node, spec) {
        if (!spec && this.options.flowOptions.insertSpec) {
            node.setSpec(this.options.flowOptions.insertSpec);
        }
    }

    /**
     * Helper that detects when layout is scrolling optimized (default: true).
     */
    _isSequentiallyScrollingOptimized() {
        return !this._layout.capabilities ||
            (this._layout.capabilities.sequentialScrollingOptimized === undefined) ||
            this._layout.capabilities.sequentialScrollingOptimized;
    }

    /**
     * Helper function for logging debug statements to the console.
     */
    /*function _log(args) {
     if (!this.options.debug) {
     return;
     }
     var message = this._debug.commitCount + ': ';
     for (var i = 0, j = arguments.length; i < j; i++) {
     var arg = arguments[i];
     if ((arg instanceof Object) || (arg instanceof Array)) {
     message += JSON.stringify(arg);
     }
     else {
     message += arg;
     }
     }
     console.log(message);
     }*/

    /**
     * Sets the value for the spring, or set to `undefined` to disable the spring
     */
    _updateSpring() {
        var springValue = this._scroll.scrollForceCount ? undefined : this._scroll.springPosition;
        if (this._scroll.springValue !== springValue) {
            this._scroll.springValue = springValue;
            if (springValue === undefined) {
                if (this._scroll.springForceId !== undefined) {
                    this._scroll.pe.detach(this._scroll.springForceId);
                    this._scroll.springForceId = undefined;
                    //_log.call(this, 'disabled spring');
                }
            }
            else {
                if (this._scroll.springForceId === undefined) {
                    this._scroll.springForceId = this._scroll.pe.attach(this._scroll.springForce, this._scroll.particle);
                }
                this._scroll.springEndState.set1D(springValue);
                this._scroll.pe.wake();
                //_log.call(this, 'setting spring to: ', springValue, ' (', this._scroll.springSource, ')');
            }
        }
    }

    /**
     * Returns the time from the given input event.
     */
    static _getEventTimestamp(event) {
        return event.timeStamp || Date.now();
    }

    /**
     * Called whenever the user presses the mouse button on the scrollview
     */
    _mouseDown(event) {

        // Check whether mouse-scrolling is enabled
        if (!this.options.mouseMove) {
            return;
        }

        // Reset any previous mouse-move operation that has not yet been
        // cleared.
        if (this._scroll.mouseMove) {
            this.releaseScrollForce(this._scroll.mouseMove.delta);
        }

        // Calculate start of move operation
        var current = [event.clientX, event.clientY];
        var time = _getEventTimestamp(event);
        this._scroll.mouseMove = {
            delta: 0,
            start: current,
            current: current,
            prev: current,
            time: time,
            prevTime: time
        };

        // Apply scroll force
        this.applyScrollForce(this._scroll.mouseMove.delta);
    }

    _mouseMove(event) {

        // Check if any mouse-move is active
        if (!this._scroll.mouseMove || !this.options.enabled) {
            return;
        }

        // When a thresshold is configured, check whether the move operation (x/y ratio)
        // lies within the thresshold. A move of 10 pixels x and 10 pixels y is considered 45 deg,
        // which corresponds to a thresshold of 0.5.
        var moveDirection = Math.atan2(
                Math.abs(event.clientY - this._scroll.mouseMove.prev[1]),
                Math.abs(event.clientX - this._scroll.mouseMove.prev[0])) / (Math.PI / 2.0);
        var directionDiff = Math.abs(this._direction - moveDirection);
        if ((this.options.touchMoveDirectionThreshold === undefined) || (directionDiff <= this.options.touchMoveDirectionThreshold)){
            this._scroll.mouseMove.prev = this._scroll.mouseMove.current;
            this._scroll.mouseMove.current = [event.clientX, event.clientY];
            this._scroll.mouseMove.prevTime = this._scroll.mouseMove.time;
            this._scroll.mouseMove.direction = moveDirection;
            this._scroll.mouseMove.time = _getEventTimestamp(event);
        }

        // Update scroll-force
        var delta = this._scroll.mouseMove.current[this._direction] - this._scroll.mouseMove.start[this._direction];
        this.updateScrollForce(this._scroll.mouseMove.delta, delta);
        this._scroll.mouseMove.delta = delta;
    }

    _mouseUp(event) {

        // Check if any mouse-move is active
        if (!this._scroll.mouseMove) {
            return;
        }

        // Calculate delta and velocity
        var velocity = 0;
        var diffTime = this._scroll.mouseMove.time - this._scroll.mouseMove.prevTime;
        if ((diffTime > 0) && ((_getEventTimestamp(event) - this._scroll.mouseMove.time) <= this.options.touchMoveNoVelocityDuration)) {
            var diffOffset = this._scroll.mouseMove.current[this._direction] - this._scroll.mouseMove.prev[this._direction];
            velocity = diffOffset / diffTime;
        }

        // Release scroll force
        var swipeDirection = (Math.abs(this._scroll.mouseMove.current[0] - this._scroll.mouseMove.prev[0]) > Math.abs(this._scroll.mouseMove.current[1] - this._scroll.mouseMove.prev[1])) ? 0 : 1;
        var allowSwipes = (swipeDirection === this._direction);
        this.releaseScrollForce(this._scroll.mouseMove.delta, velocity, allowSwipes);
        this._scroll.mouseMove = undefined;
    }

    /**
     * Called whenever the user starts moving the scroll-view, using
     * touch gestures.
     */
    _touchStart(event) {

        // Create touch-end event listener
        if (!this._touchEndEventListener) {
            this._touchEndEventListener = (event2) => {
                event2.target.removeEventListener('touchend', this._touchEndEventListener);
                this._touchEnd(event2);
            };
        }

        // Remove any touches that are no longer active
        var oldTouchesCount = this._scroll.activeTouches.length;
        var i = 0;
        var j;
        var touchFound;
        while (i < this._scroll.activeTouches.length) {
            var activeTouch = this._scroll.activeTouches[i];
            touchFound = false;
            for (j = 0; j < event.touches.length; j++) {
                var touch = event.touches[j];
                if (touch.identifier === activeTouch.id) {
                    touchFound = true;
                    break;
                }
            }
            if (!touchFound) {
                //_log.cal(this, 'removing touch with id: ', activeTouch.id);
                this._scroll.activeTouches.splice(i, 1);
            }
            else {
                i++;
            }
        }

        // Process touch
        for (i = 0; i < event.touches.length; i++) {
            var changedTouch = event.touches[i];
            touchFound = false;
            for (j = 0; j < this._scroll.activeTouches.length; j++) {
                if (this._scroll.activeTouches[j].id === changedTouch.identifier) {
                    touchFound = true;
                    break;
                }
            }
            if (!touchFound) {
                var current = [changedTouch.clientX, changedTouch.clientY];
                var time = _getEventTimestamp(event);
                this._scroll.activeTouches.push({
                    id: changedTouch.identifier,
                    start: current,
                    current: current,
                    prev: current,
                    time: time,
                    prevTime: time
                });

                // The following listener is automatically removed after touchend is received
                // and ensures that the scrollview always received touchend.
                changedTouch.target.addEventListener('touchend', this._touchEndEventListener);
            }
        }

        // The first time a touch new touch gesture has arrived, emit event
        if (!oldTouchesCount && this._scroll.activeTouches.length) {
            this.applyScrollForce(0);
            this._scroll.touchDelta = 0;
        }
    }

    /**
     * Called whenever the user is moving his/her fingers to scroll the view.
     * Updates the moveOffset so that the scroll-offset on the view is updated.
     */
    _touchMove(event) {
        if (!this.options.enabled) {
            return;
        }

        // Process the touch event
        var primaryTouch;
        for (var i = 0; i < event.changedTouches.length; i++) {
            var changedTouch = event.changedTouches[i];
            for (var j = 0; j < this._scroll.activeTouches.length; j++) {
                var touch = this._scroll.activeTouches[j];
                if (touch.id === changedTouch.identifier) {

                    // When a thresshold is configured, check whether the move operation (x/y ratio)
                    // lies within the thresshold. A move of 10 pixels x and 10 pixels y is considered 45 deg,
                    // which corresponds to a thresshold of 0.5.
                    var moveDirection = Math.atan2(
                            Math.abs(changedTouch.clientY - touch.prev[1]),
                            Math.abs(changedTouch.clientX - touch.prev[0])) / (Math.PI / 2.0);
                    var directionDiff = Math.abs(this._direction - moveDirection);
                    if ((this.options.touchMoveDirectionThreshold === undefined) || (directionDiff <= this.options.touchMoveDirectionThreshold)){
                        touch.prev = touch.current;
                        touch.current = [changedTouch.clientX, changedTouch.clientY];
                        touch.prevTime = touch.time;
                        touch.direction = moveDirection;
                        touch.time = _getEventTimestamp(event);
                        primaryTouch = (j === 0) ? touch : undefined;
                    }
                }
            }
        }

        // Update move offset and emit event
        if (primaryTouch) {
            var delta = primaryTouch.current[this._direction] - primaryTouch.start[this._direction];
            this.updateScrollForce(this._scroll.touchDelta, delta);
            this._scroll.touchDelta = delta;
        }
    }

    /**
     * Called whenever the user releases his fingers and the touch gesture
     * has completed. This will set the new position and if the user used a 'flick'
     * gesture give the scroll-offset particle a velocity and momentum into a
     * certain direction.
     */
    _touchEnd(event) {

        // Remove touch
        var primaryTouch = this._scroll.activeTouches.length ? this._scroll.activeTouches[0] : undefined;
        for (var i = 0; i < event.changedTouches.length; i++) {
            var changedTouch = event.changedTouches[i];
            for (var j = 0; j < this._scroll.activeTouches.length; j++) {
                var touch = this._scroll.activeTouches[j];
                if (touch.id === changedTouch.identifier) {

                    // Remove touch from active-touches
                    this._scroll.activeTouches.splice(j, 1);

                    // When a different touch now becomes the primary touch, update
                    // its start position to match the current move offset.
                    if ((j === 0) && this._scroll.activeTouches.length) {
                        var newPrimaryTouch = this._scroll.activeTouches[0];
                        newPrimaryTouch.start[0] = newPrimaryTouch.current[0] - (touch.current[0] - touch.start[0]);
                        newPrimaryTouch.start[1] = newPrimaryTouch.current[1] - (touch.current[1] - touch.start[1]);
                    }
                    break;
                }
            }
        }

        // Wait for all fingers to be released from the screen before resetting the move-spring
        if (!primaryTouch || this._scroll.activeTouches.length) {
            return;
        }

        // Determine velocity and add to particle
        var velocity = 0;
        var diffTime = primaryTouch.time - primaryTouch.prevTime;
        if ((diffTime > 0) && ((_getEventTimestamp(event) - primaryTouch.time) <= this.options.touchMoveNoVelocityDuration)) {
            var diffOffset = primaryTouch.current[this._direction] - primaryTouch.prev[this._direction];
            velocity = diffOffset / diffTime;
        }

        // Release scroll force
        var delta = this._scroll.touchDelta;
        var swipeDirection = (Math.abs(primaryTouch.current[0] - primaryTouch.prev[0]) > Math.abs(primaryTouch.current[1] - primaryTouch.prev[1])) ? 0 : 1;
        var allowSwipes = (swipeDirection === this._direction);
        this.releaseScrollForce(delta, velocity, allowSwipes);
        this._scroll.touchDelta = 0;
    }

    /**
     * Called whenever the user is scrolling the view using either a mouse
     * scroll wheel or a track-pad.
     */
    _scrollUpdate(event) {
        if (!this.options.enabled) {
            return;
        }

        var offset = Array.isArray(event.delta) ? event.delta[this._direction] : event.delta;

        if(this.options.scrollWheelForces){
            var velocity = offset / this.options.scrollWheelForceStep;

            this.applyScrollForce(offset);
            this.releaseScrollForce(offset, velocity);
        } else {
            this.scroll(offset);
        }
    }

    /**
     * Updates the scroll offset particle.
     */
    _setParticle(position, velocity, phase) {
        if (position !== undefined) {
            //var oldPosition = this._scroll.particle.getPosition1D();
            this._scroll.particleValue = position;
            this._scroll.particle.setPosition1D(position);
            //_log.call(this, 'setParticle.position: ', position, ' (old: ', oldPosition, ', delta: ', position - oldPosition, ', phase: ', phase, ')');
            if (this._scroll.springValue !== undefined) {
                this._scroll.pe.wake();
            }
        }
        if (velocity !== undefined) {
            var oldVelocity = this._scroll.particle.getVelocity1D();
            if (oldVelocity !== velocity) {
                this._scroll.particle.setVelocity1D(velocity);
                //_log.call(this, 'setParticle.velocity: ', velocity, ' (old: ', oldVelocity, ', delta: ', velocity - oldVelocity, ', phase: ', phase, ')');
            }
        }
    }

    /**
     * Get the in-use scroll-offset.
     */
    _calcScrollOffset(normalize, refreshParticle) {

        // When moving using touch-gestures, make the offset stick to the
        // finger. When the bounds is exceeded, decrease the scroll distance
        // by two.
        if (refreshParticle || (this._scroll.particleValue === undefined)) {
            this._scroll.particleValue = this._scroll.particle.getPosition1D();
            this._scroll.particleValue = Math.round(this._scroll.particleValue * 1000) / 1000;
        }

        // do stuff
        var scrollOffset = this._scroll.particleValue;
        if (this._scroll.scrollDelta || this._scroll.normalizedScrollDelta) {
            scrollOffset += this._scroll.scrollDelta + this._scroll.normalizedScrollDelta;
            if (((this._scroll.boundsReached & Bounds.PREV) && (scrollOffset > this._scroll.springPosition)) ||
                ((this._scroll.boundsReached & Bounds.NEXT) && (scrollOffset < this._scroll.springPosition)) ||
                (this._scroll.boundsReached === Bounds.BOTH)) {
                scrollOffset = this._scroll.springPosition;
            }
            if (normalize) {
                if (!this._scroll.scrollDelta) {
                    this._scroll.normalizedScrollDelta = 0;
                    this._setParticle(scrollOffset, undefined, '_calcScrollOffset');
                }
                this._scroll.normalizedScrollDelta += this._scroll.scrollDelta;
                this._scroll.scrollDelta = 0;
            }
        }

        if (this._scroll.scrollForceCount && this._scroll.scrollForce) {
            if (this._scroll.springPosition !== undefined) {
                scrollOffset = (scrollOffset + this._scroll.scrollForce + this._scroll.springPosition) / 2.0;
            }
            else {
                scrollOffset += this._scroll.scrollForce;
            }
        }

        // Prevent the scroll position from exceeding the bounds when overscroll is disabled
        if (!this.options.overscroll) {
            if ((this._scroll.boundsReached === Bounds.BOTH) ||
                ((this._scroll.boundsReached === Bounds.PREV) && (scrollOffset > this._scroll.springPosition)) ||
                ((this._scroll.boundsReached === Bounds.NEXT) && (scrollOffset < this._scroll.springPosition))) {
                scrollOffset = this._scroll.springPosition;
            }
        }

        //_log.call(this, 'scrollOffset: ', scrollOffset, ', particle:', this._scroll.particle.getPosition1D(), ', moveToPosition: ', this._scroll.moveToPosition, ', springPosition: ', this._scroll.springPosition);
        return scrollOffset;
    }

    /**
     * Helper function that calculates the next/prev layed out height.
     * @private
     */
    _calcScrollHeight(next, lastNodeOnly) {
        var calcedHeight = 0;
        var node = this._nodes.getStartEnumNode(next);
        while (node) {
            if (node._invalidated) {
                if (node.trueSizeRequested) {
                    calcedHeight = undefined;
                    break;
                }
                if (node.scrollLength !== undefined) {
                    calcedHeight = lastNodeOnly ? node.scrollLength : (calcedHeight + node.scrollLength);
                    if (!next && lastNodeOnly) {
                        break;
                    }
                }
            }
            node = next ? node._next : node._prev;
        }
        return calcedHeight;
    };

    /**
     * Calculates the scroll boundaries and sets the spring accordingly.
     */
    _calcBounds(size, scrollOffset) {

        // Local data
        var prevHeight = this._calcScrollHeight(false);
        var nextHeight = this._calcScrollHeight(true);
        var enforeMinSize = this._isSequentiallyScrollingOptimized();

        // 1. When the rendered height is smaller than the total height,
        //    then lock to the primary bounds
        var totalHeight;
        if (enforeMinSize) {
            if ((nextHeight !== undefined) && (prevHeight !== undefined)) {
                totalHeight = prevHeight + nextHeight;
            }
            if ((totalHeight !== undefined) && (totalHeight <= size[this._direction])) {
                this._scroll.boundsReached = Bounds.BOTH;
                this._scroll.springPosition = this.options.alignment ? -nextHeight : prevHeight;
                this._scroll.springSource = SpringSource.MINSIZE;
                return;
            }
        }
        totalHeight = (prevHeight || 0) + (nextHeight || 0);

        // 2. Check whether primary boundary has been reached
        if (this.options.alignment) {
            if (enforeMinSize) {
                if ((nextHeight !== undefined) && ((scrollOffset + nextHeight) <= 0)) {
                    this._scroll.boundsReached = Bounds.NEXT;
                    this._scroll.springPosition = -nextHeight;
                    this._scroll.springSource = SpringSource.NEXTBOUNDS;
                    return;
                }
            }
            else {
                var firstPrevItemHeight = this._calcScrollHeight(false, true);
                if ((nextHeight !== undefined) && firstPrevItemHeight && ((scrollOffset + nextHeight + size[this._direction]) <= firstPrevItemHeight)) {
                    this._scroll.boundsReached = Bounds.NEXT;
                    this._scroll.springPosition = nextHeight - (size[this._direction] - firstPrevItemHeight);
                    this._scroll.springSource = SpringSource.NEXTBOUNDS;
                    return;
                }
            }
        }
        else {
            if ((prevHeight !== undefined) && ((scrollOffset - prevHeight) >= 0)) {
                this._scroll.boundsReached = Bounds.PREV;
                this._scroll.springPosition = prevHeight;
                this._scroll.springSource = SpringSource.PREVBOUNDS;
                return;
            }
        }

        // 3. Check if secondary bounds has been reached
        if (this.options.alignment) {
            if ((prevHeight !== undefined) && (totalHeight > size[this._direction]) && ((scrollOffset - prevHeight) >= -size[this._direction])) {
                this._scroll.boundsReached = Bounds.PREV;
                this._scroll.springPosition = -size[this._direction] + prevHeight;
                this._scroll.springSource = SpringSource.PREVBOUNDS;
                return;
            }
        }
        else {
            var nextBounds = enforeMinSize ? size[this._direction] : this._calcScrollHeight(true, true);
            if ((nextHeight !== undefined) && ((scrollOffset + nextHeight) <= nextBounds)){
                this._scroll.boundsReached = Bounds.NEXT;
                this._scroll.springPosition = nextBounds - nextHeight;
                this._scroll.springSource = SpringSource.NEXTBOUNDS;
                return;
            }
        }

        // No bounds reached
        this._scroll.boundsReached = Bounds.NONE;
        this._scroll.springPosition = undefined;
        this._scroll.springSource = SpringSource.NONE;
    }

    /**
     * Calculates the scrollto-offset to which the spring is set when doing scrollToRenderNode.
     */
    _calcScrollToOffset(size, scrollOffset) {
        var scrollToRenderNode = this._scroll.scrollToRenderNode || this._scroll.ensureVisibleRenderNode;
        if (!scrollToRenderNode) {
            return;
        }

        // 1. When boundary is reached, stop scrolling in that direction
        if ((this._scroll.boundsReached === Bounds.BOTH) ||
            (!this._scroll.scrollToDirection && (this._scroll.boundsReached === Bounds.PREV)) ||
            (this._scroll.scrollToDirection && (this._scroll.boundsReached === Bounds.NEXT))) {
            return;
        }

        // 2. Find the node to scroll to
        var foundNode;
        var scrollToOffset = 0;
        var node = this._nodes.getStartEnumNode(true);
        var count = 0;
        while (node) {
            count++;
            if (!node._invalidated || (node.scrollLength === undefined)) {
                break;
            }
            if (this.options.alignment) {
                scrollToOffset -= node.scrollLength;
            }
            if (node.renderNode === scrollToRenderNode) {
                foundNode = node;
                break;
            }
            if (!this.options.alignment) {
                scrollToOffset -= node.scrollLength;
            }
            node = node._next;
        }
        if (!foundNode) {
            scrollToOffset = 0;
            node = this._nodes.getStartEnumNode(false);
            while (node) {
                if (!node._invalidated || (node.scrollLength === undefined)) {
                    break;
                }
                if (!this.options.alignment) {
                    scrollToOffset += node.scrollLength;
                }
                if (node.renderNode === scrollToRenderNode) {
                    foundNode = node;
                    break;
                }
                if (this.options.alignment) {
                    scrollToOffset += node.scrollLength;
                }
                node = node._prev;
            }
        }

        // 3. Update springs
        if (foundNode) {
            if (this._scroll.ensureVisibleRenderNode) {
                if (this.options.alignment) {
                    if ((scrollToOffset - foundNode.scrollLength) < 0) {
                        this._scroll.springPosition = scrollToOffset;
                        this._scroll.springSource = SpringSource.ENSUREVISIBLE;
                    }
                    else if (scrollToOffset > size[this._direction]) {
                        this._scroll.springPosition = size[this._direction] - scrollToOffset;
                        this._scroll.springSource = SpringSource.ENSUREVISIBLE;
                    }
                    else {
                        if (!foundNode.trueSizeRequested) {
                            this._scroll.ensureVisibleRenderNode = undefined;
                        }
                    }
                }
                else {
                    scrollToOffset = -scrollToOffset;
                    if (scrollToOffset < 0) {
                        this._scroll.springPosition = scrollToOffset;
                        this._scroll.springSource = SpringSource.ENSUREVISIBLE;
                    }
                    else if ((scrollToOffset + foundNode.scrollLength) > size[this._direction]) {
                        this._scroll.springPosition = size[this._direction] - (scrollToOffset + foundNode.scrollLength);
                        this._scroll.springSource = SpringSource.ENSUREVISIBLE;
                    }
                    else {
                        if (!foundNode.trueSizeRequested) {
                            this._scroll.ensureVisibleRenderNode = undefined;
                        }
                    }
                }
            }
            else { // scrollToSequence
                this._scroll.springPosition = scrollToOffset;
                this._scroll.springSource = SpringSource.GOTOSEQUENCE;
            }
            return;
        }

        // 4. When node not found, keep searching
        if (this._scroll.scrollToDirection) {
            this._scroll.springPosition = scrollOffset - size[this._direction];
            this._scroll.springSource = SpringSource.GOTONEXTDIRECTION;
        }
        else {
            this._scroll.springPosition = scrollOffset + size[this._direction];
            this._scroll.springSource = SpringSource.GOTOPREVDIRECTION;
        }

        // 5. In case of a VirtualViewSequnce, make sure all the view-sequence nodes are touched, so
        //    that they are not cleaned up.
        if (this._viewSequence.cleanup) {
            var viewSequence = this._viewSequence;
            while (viewSequence.get() !== scrollToRenderNode) {
                viewSequence = this._scroll.scrollToDirection ? viewSequence.getNext(true) : viewSequence.getPrevious(true);
                if (!viewSequence) {
                    break;
                }
            }
        }
    }

    /**
     * Snaps to a page when pagination is enabled.
     */
    _snapToPage() {

        // Check whether pagination is active
        if (!this.options.paginated ||
            this._scroll.scrollForceCount || //don't paginate while moving
            (this._scroll.springPosition !== undefined)) {
            return;
        }

        // When the energy is below the thresshold, paginate to the current page
        var item;
        switch (this.options.paginationMode) {
            case PaginationMode.SCROLL:
                if (!this.options.paginationEnergyThreshold || (Math.abs(this._scroll.particle.getEnergy()) <= this.options.paginationEnergyThreshold)) {
                    item = this.options.alignment ? this.getLastVisibleItem() : this.getFirstVisibleItem();
                    if (item && item.renderNode) {
                        this.goToRenderNode(item.renderNode);
                    }
                }
                break;
            case PaginationMode.PAGE:
                item = this.options.alignment ? this.getLastVisibleItem() : this.getFirstVisibleItem();
                if (item && item.renderNode) {
                    this.goToRenderNode(item.renderNode);
                }
                break;
        }
    }

    /**
     * Normalizes the view-sequence node so that the view-sequence is near to 0.
     */
    _normalizePrevViewSequence(scrollOffset) {
        var count = 0;
        var normalizedScrollOffset = scrollOffset;
        var normalizeNextPrev = false;
        var node = this._nodes.getStartEnumNode(false);
        while (node) {
            if (!node._invalidated || !node._viewSequence) {
                break;
            }
            if (normalizeNextPrev) {
                this._viewSequence = node._viewSequence;
                normalizedScrollOffset = scrollOffset;
                normalizeNextPrev = false;
            }
            if ((node.scrollLength === undefined) || node.trueSizeRequested || (scrollOffset < 0)) {
                break;
            }
            scrollOffset -= node.scrollLength;
            count++;
            if (node.scrollLength) {
                if (this.options.alignment) {
                    normalizeNextPrev = (scrollOffset >= 0);
                }
                else {
                    if (Math.round(scrollOffset) >= 0) {
                        this._viewSequence = node._viewSequence;
                        normalizedScrollOffset = scrollOffset;
                    }
                }
            }
            node = node._prev;
        }
        return normalizedScrollOffset;
    }


    _normalizeNextViewSequence(scrollOffset) {
        var count = 0;
        var normalizedScrollOffset = scrollOffset;
        var node = this._nodes.getStartEnumNode(true);
        while (node) {
            if (!node._invalidated || (node.scrollLength === undefined) || node.trueSizeRequested || !node._viewSequence ||
                ((Math.round(scrollOffset) > 0) && (!this.options.alignment || (node.scrollLength !== 0)))) {
                break;
            }
            if (this.options.alignment) {
                scrollOffset += node.scrollLength;
                count++;
            }
            if (node.scrollLength || this.options.alignment) {
                this._viewSequence = node._viewSequence;
                normalizedScrollOffset = scrollOffset;
            }
            if (!this.options.alignment) {
                scrollOffset += node.scrollLength;
                count++;
            }
            node = node._next;
        }
        return normalizedScrollOffset;
    }


    _normalizeViewSequence(size, scrollOffset) {

        // Check whether normalisation is disabled
        var caps = this._layout.capabilities;
        if (caps && caps.debug &&
            (caps.debug.normalize !== undefined) &&
            !caps.debug.normalize) {
            return scrollOffset;
        }

        // Don't normalize when forces are at work
        if (this._scroll.scrollForceCount) {
            return scrollOffset;
        }

        // 1. Normalize in primary direction
        var normalizedScrollOffset = scrollOffset;
        if (this.options.alignment && (scrollOffset < 0)) {
            normalizedScrollOffset = this._normalizeNextViewSequence(scrollOffset);
        }
        else if (!this.options.alignment && (scrollOffset > 0)){
            normalizedScrollOffset = this._normalizePrevViewSequence(scrollOffset);
        }

        // 2. Normalize in secondary direction
        if (normalizedScrollOffset === scrollOffset) {
            if (this.options.alignment && (scrollOffset > 0)) {
                normalizedScrollOffset = this._normalizePrevViewSequence(scrollOffset);
            }
            else if (!this.options.alignment && (scrollOffset < 0)) {
                normalizedScrollOffset = this._normalizeNextViewSequence(scrollOffset);
            }
        }

        // Adjust particle and springs
        if (normalizedScrollOffset !== scrollOffset) {
            var delta = normalizedScrollOffset - scrollOffset;

            // Adjust particle
            var particleValue = this._scroll.particle.getPosition1D();
            //var particleValue = this._scroll.particleValue;
            this._setParticle(particleValue + delta, undefined, 'normalize');
            //console.log('normalized scrollOffset: ', normalizedScrollOffset, ', old: ', scrollOffset, ', particle: ', particleValue + delta);

            // Adjust scroll spring
            if (this._scroll.springPosition !== undefined) {
                this._scroll.springPosition += delta;
            }

            // Adjust group offset
            if (this._isSequentiallyScrollingOptimized()) {
                this._scroll.groupStart -= delta;
            }
        }
        return normalizedScrollOffset;
    }

    /**
     * Get all items that are partly or completely visible.
     *
     * The returned result is an array of objects containing the
     * following properties. Example:
     * ```javascript
     * {
     *   viewSequence: {LinkedListViewSequence},
     *   index: {Number},
     *   renderNode: {renderable},
     *   visiblePerc: {Number} 0..1
     * }
     * ```
     * @return {Array} array of items
     */
    getVisibleItems() {
        var size = this._contextSizeCache;
        var scrollOffset = this.options.alignment ? (this._scroll.unnormalizedScrollOffset + size[this._direction]) : this._scroll.unnormalizedScrollOffset;
        var result = [];
        var node = this._nodes.getStartEnumNode(true);
        while (node) {
            if (!node._invalidated || (node.scrollLength === undefined) || (scrollOffset > size[this._direction])) {
                break;
            }
            scrollOffset += node.scrollLength;
            if ((scrollOffset >= 0) && node._viewSequence){
                result.push({
                    index: node._viewSequence.getIndex(),
                    viewSequence: node._viewSequence,
                    renderNode: node.renderNode,
                    visiblePerc: node.scrollLength ? ((Math.min(scrollOffset, size[this._direction]) - Math.max(scrollOffset - node.scrollLength, 0)) / node.scrollLength) : 1,
                    scrollOffset: scrollOffset - node.scrollLength,
                    scrollLength: node.scrollLength,
                    _node: node
                });
            }
            node = node._next;
        }
        scrollOffset = this.options.alignment ? (this._scroll.unnormalizedScrollOffset + size[this._direction]) : this._scroll.unnormalizedScrollOffset;
        node = this._nodes.getStartEnumNode(false);
        while (node) {
            if (!node._invalidated || (node.scrollLength === undefined) || (scrollOffset < 0)) {
                break;
            }
            scrollOffset -= node.scrollLength;
            if ((scrollOffset < size[this._direction]) && node._viewSequence) {
                result.unshift({
                    index: node._viewSequence.getIndex(),
                    viewSequence: node._viewSequence,
                    renderNode: node.renderNode,
                    visiblePerc: node.scrollLength ? ((Math.min(scrollOffset + node.scrollLength, size[this._direction]) - Math.max(scrollOffset, 0)) / node.scrollLength) : 1,
                    scrollOffset: scrollOffset,
                    scrollLength: node.scrollLength,
                    _node: node
                });
            }
            node = node._prev;
        }
        return result;
    }

    /**
     * Get the first or last visible item in the view.
     */
    _getVisibleItem(first) {
        var result = {};
        var diff;
        var prevDiff = 10000000;
        var diffDelta = (first && this.options.alignment) ? -this._contextSizeCache[this._direction] : ((!first && !this.options.alignment) ? this._contextSizeCache[this._direction] : 0);
        var scrollOffset = this._scroll.unnormalizedScrollOffset;
        var node = this._nodes.getStartEnumNode(true);
        while (node) {
            if (!node._invalidated || (node.scrollLength === undefined)) {
                break;
            }
            if (node._viewSequence) {
                diff = Math.abs(diffDelta - (scrollOffset + (!first ? node.scrollLength : 0)));
                if (diff >= prevDiff) {
                    break;
                }
                prevDiff = diff;
                result.scrollOffset = scrollOffset;
                result._node = node;
                scrollOffset += node.scrollLength;
            }
            node = node._next;
        }
        scrollOffset = this._scroll.unnormalizedScrollOffset;
        node = this._nodes.getStartEnumNode(false);
        while (node) {
            if (!node._invalidated || (node.scrollLength === undefined)) {
                break;
            }
            if (node._viewSequence) {
                scrollOffset -= node.scrollLength;
                diff = Math.abs(diffDelta - (scrollOffset + (!first ? node.scrollLength : 0)));
                if (diff >= prevDiff) {
                    break;
                }
                prevDiff = diff;
                result.scrollOffset = scrollOffset;
                result._node = node;
            }
            node = node._prev;
        }
        if (!result._node) {
            return undefined;
        }
        result.scrollLength = result._node.scrollLength;
        if (this.options.alignment) {
            result.visiblePerc = (Math.min(result.scrollOffset + result.scrollLength, 0) - Math.max(result.scrollOffset, -this._contextSizeCache[this._direction])) / result.scrollLength;
        }
        else {
            result.visiblePerc = (Math.min(result.scrollOffset + result.scrollLength, this._contextSizeCache[this._direction]) - Math.max(result.scrollOffset, 0)) / result.scrollLength;
        }
        result.index = result._node._viewSequence.getIndex();
        result.viewSequence = result._node._viewSequence;
        result.renderNode = result._node.renderNode;
        return result;
    }

    /**
     * Get the first visible item in the view.
     *
     * @return {Object} item or `undefined`
     */
    getFirstVisibleItem() {
        return this._getVisibleItem(true);
    };


    /**
     * Forces a new layout the next render cycle, manipulating flow state (in constrast to reflowLayout).
     *
     * @return {LayoutController} this
     */
    reLayout() {
        return this._reLayout = true;
    };

    /**
     * Get the last visible item in the view.
     *
     * @return {Object} item or `undefined`
     */
    getLastVisibleItem() {
        return this._getVisibleItem(false);
    }

    /**
     * Helper function that goes to a view-sequence either by scrolling
     * or immediately without any scrolling animation.
     */
    _goToSequence(viewSequence, next, noAnimation) {
        if (noAnimation) {
            this._viewSequence = viewSequence;
            this._scroll.springPosition = undefined;
            this._updateSpring();
            this.halt();
            this._scroll.scrollDelta = 0;
            this._setParticle(0, 0, '_goToSequence');
            this._scroll.scrollDirty = true;
        }
        else {
            this._scroll.scrollToSequence = viewSequence;
            this._scroll.scrollToRenderNode = viewSequence.get();
            this._scroll.ensureVisibleRenderNode = undefined;
            this._scroll.scrollToDirection = next;
            this._scroll.scrollDirty = true;
        }
    }

    /**
     * Helper function that scrolls the view towards a view-sequence node.
     */
    _ensureVisibleSequence(viewSequence, next) {
            this._scroll.scrollToSequence = undefined;
            this._scroll.scrollToRenderNode = undefined;
            this._scroll.ensureVisibleRenderNode = viewSequence.get();
            this._scroll.scrollToDirection = next;
            this._scroll.scrollDirty = true;
    }

    /**
     * Moves to the next node in the viewSequence.
     *
     * @param {Number} [amount] Amount of nodes to move
     * @param {Bool} [noAnimation] When set to true, immediately shows the node without any scrolling animation.
     */
    _goToPage(amount, noAnimation) {

        // Get current scroll-position. When a previous call was made to
        // `scroll' or `scrollTo` and that node has not yet been reached, then
        // the amount is accumalated onto that scroll target.
        var viewSequence = (!noAnimation ? this._scroll.scrollToSequence : undefined) || this._viewSequence;
        if (!this._scroll.scrollToSequence && !noAnimation) {
            var firstVisibleItem = this.getFirstVisibleItem();
            if (firstVisibleItem) {
                viewSequence = firstVisibleItem.viewSequence;
                if (((amount < 0) && (firstVisibleItem.scrollOffset < 0)) ||
                    ((amount > 0) && (firstVisibleItem.scrollOffset > 0))) {
                    amount = 0;
                }
            }
        }
        if (!viewSequence) {
            return;
        }

        // Find scroll target
        for (var i = 0; i < Math.abs(amount); i++) {
            var nextViewSequence = (amount > 0) ? viewSequence.getNext() : viewSequence.getPrevious();
            if (nextViewSequence) {
                viewSequence = nextViewSequence;
            }
            else {
                break;
            }
        }
        this._goToSequence(viewSequence, amount >= 0, noAnimation);
    }

    /**
     * Goes to the first page, making it visible.
     *
     * NOTE: This function does not work on ViewSequences that have the `loop` property enabled.
     *
     * @param {Bool} [noAnimation] When set to true, immediately shows the node without any scrolling animation.
     * @return {ScrollController} this
     */
    goToFirstPage(noAnimation) {
        if (!this._viewSequence) {
            return this;
        }
        if (this._viewSequence._ && this._viewSequence._.loop) {
            LayoutUtility.error('Unable to go to first item of looped ViewSequence');
            return this;
        }
        var viewSequence = this._viewSequence;
        while (viewSequence) {
            var prev = viewSequence.getPrevious();
            if (prev && prev.get()) {
                viewSequence = prev;
            }
            else {
                break;
            }
        }
        this._goToSequence(viewSequence, false, noAnimation);
        return this;
    };

    /**
     * Goes to the previous page, making it visible.
     *
     * @param {Bool} [noAnimation] When set to true, immediately shows the node without any scrolling animation.
     * @return {ScrollController} this
     */
    goToPreviousPage(noAnimation) {
        this._goToPage(-1, noAnimation);
        return this;
    };

    /**
     * Goes to the next page, making it visible.
     *
     * @param {Bool} [noAnimation] When set to true, immediately shows the node without any scrolling animation.
     * @return {ScrollController} this
     */
    goToNextPage(noAnimation) {
        this._goToPage(1, noAnimation);
        return this;
    };

    /**
     * Goes to the last page, making it visible.
     *
     * NOTE: This function does not work on ViewSequences that have the `loop` property enabled.
     *
     * @param {Bool} [noAnimation] When set to true, immediately shows the node without any scrolling animation.
     * @return {ScrollController} this
     */
    goToLastPage(noAnimation) {
        if (!this._viewSequence) {
            return this;
        }
        if (this._viewSequence._ && this._viewSequence._.loop) {
            LayoutUtility.error('Unable to go to last item of looped ViewSequence');
            return this;
        }
        var viewSequence = this._viewSequence;
        while (viewSequence) {
            var next = viewSequence.getNext();
            if (next && next.get()) {
                viewSequence = next;
            }
            else {
                break;
            }
        }
        this._goToSequence(viewSequence, true, noAnimation);
        return this;
    };

    /**
     * Goes to the given renderable in the datasource.
     *
     * @param {RenderNode} node renderable to scroll to.
     * @param {Bool} [noAnimation] When set to true, immediately shows the node without scrolling animation.
     * @return {ScrollController} this
     */
    goToRenderNode(node, noAnimation) {

        // Verify arguments and state
        if (!this._viewSequence || !node) {
            return this;
        }

        // Check current node
        if (this._viewSequence.get() === node) {
            var next = this._calcScrollOffset() >= 0;
            this._goToSequence(this._viewSequence, next, noAnimation);
            return this;
        }

        // Find the sequence-node that we want to scroll to.
        // We look at both directions at the same time.
        // The first match that is encountered, that direction is chosen.
        var nextSequence = this._viewSequence.getNext();
        var prevSequence = this._viewSequence.getPrevious();
        while ((nextSequence || prevSequence) && (nextSequence !== this._viewSequence)){
            var nextNode = nextSequence ? nextSequence.get() : undefined;
            if (nextNode === node) {
                this._goToSequence(nextSequence, true, noAnimation);
                break;
            }
            var prevNode = prevSequence ? prevSequence.get() : undefined;
            if (prevNode === node) {
                this._goToSequence(prevSequence, false, noAnimation);
                break;
            }
            nextSequence = nextNode ? nextSequence.getNext() : undefined;
            prevSequence = prevNode ? prevSequence.getPrevious() : undefined;
        }
        return this;
    };

    /**
     * Ensures that a render-node is entirely visible.
     *
     * When the node is already visible, nothing happens. If the node is not entirely visible
     * the view is scrolled as much as needed to make it entirely visibl.
     *
     * @param {Number|LinkedListViewSequence|Renderable} node index, renderNode or LinkedListViewSequence
     * @return {ScrollController} this
     */
    ensureVisible(node) {

        // Convert argument into renderNode
        if (node instanceof LinkedListViewSequence) {
            node = node.get();
        }
        else if ((node instanceof Number) || (typeof node === 'number')) {
            var viewSequence = this._viewSequence;
            while (viewSequence.getIndex() < node) {
                viewSequence = viewSequence.getNext();
                if (!viewSequence) {
                    return this;
                }
            }
            while (viewSequence.getIndex() > node) {
                viewSequence = viewSequence.getPrevious();
                if (!viewSequence) {
                    return this;
                }
            }
        }

        // Check current node
        if (this._viewSequence.get() === node) {
            var next = this._calcScrollOffset() >= 0;
            this._ensureVisibleSequence(this._viewSequence, next);
            return this;
        }

        // Find the sequence-node that we want to scroll to.
        // We look at both directions at the same time.
        // The first match that is encountered, that direction is chosen.
        var nextSequence = this._viewSequence.getNext();
        var prevSequence = this._viewSequence.getPrevious();
        while ((nextSequence || prevSequence) && (nextSequence !== this._viewSequence)){
            var nextNode = nextSequence ? nextSequence.get() : undefined;
            if (nextNode === node) {
                this._ensureVisibleSequence(nextSequence, true);
                break;
            }
            var prevNode = prevSequence ? prevSequence.get() : undefined;
            if (prevNode === node) {
                this._ensureVisibleSequence(prevSequence, false);
                break;
            }
            nextSequence = nextNode ? nextSequence.getNext() : undefined;
            prevSequence = prevNode ? prevSequence.getPrevious() : undefined;
        }

        return this;
    };

    /**
     * Scrolls the view by the specified number of pixels.
     *
     * @param {Number} delta Delta in pixels (< 0 = down/right, > 0 = top/left).
     * @return {ScrollController} this
     */
    scroll(delta) {
        this.halt();
        this._scroll.scrollDelta += delta;
        return this;
    };

    /**
     * Checks whether the scrollview can scroll the given delta.
     * When the scrollView can scroll the whole delta, then
     * the return value is the same as the delta. If it cannot
     * scroll the entire delta, the return value is the number of
     * pixels that can be scrolled.
     *
     * @param {Number} delta Delta to test
     * @return {Number} Number of pixels the view is allowed to scroll
     */
    canScroll(delta) {

        // Calculate height in both directions
        var scrollOffset = this._calcScrollOffset();
        var prevHeight = this._calcScrollHeight(false);
        var nextHeight = this._calcScrollHeight(true);

        // When the rendered height is smaller than the total height,
        // then no scrolling whatsover is allowed.
        var totalHeight;
        if ((nextHeight !== undefined) && (prevHeight !== undefined)) {
            totalHeight = prevHeight + nextHeight;
        }
        if ((totalHeight !== undefined) && (totalHeight <= this._contextSizeCache[this._direction])) {
            return 0; // no scrolling at all allowed
        }

        // Determine the offset that we can scroll
        if ((delta < 0) && (nextHeight !== undefined)) {
            var nextOffset = this._contextSizeCache[this._direction] - (scrollOffset + nextHeight);
            return Math.max(nextOffset, delta);
        }
        else if ((delta > 0) && (prevHeight !== undefined)) {
            var prevOffset = -(scrollOffset - prevHeight);
            return Math.min(prevOffset, delta);
        }
        return delta;
    }

    /**
     * Halts all scrolling going on. In essence this function sets
     * the velocity to 0 and cancels any `goToXxx` operation that
     * was applied.
     *
     * @return {ScrollController} this
     */
    halt() {
        this._scroll.scrollToSequence = undefined;
        this._scroll.scrollToRenderNode = undefined;
        this._scroll.ensureVisibleRenderNode = undefined;
        this._setParticle(undefined, 0, 'halt');
        return this;
    }

    /**
     * Checks whether scrolling is in progress or not.
     *
     * @return {Bool} true when scrolling is active
     */
    isScrolling() {
        return this._scroll.isScrolling;
    }

    /**
     * Checks whether user is touching the ScrollController.
     *
     * @return {Bool} true when user is touching the ScrollController
     */
    isTouching() {
        return this._scroll.activeTouches.length > 0;
    }

    /**
     * Checks whether any boundaries have been reached.
     *
     * @return {ScrollController.Bounds} Either, Bounds.PREV, Bounds.NEXT, Bounds.BOTH or Bounds.NONE
     */
    getBoundsReached() {
        return this._scroll.boundsReached;
    }

    /**
     * Get the current scrolling velocity.
     *
     * @return {Number} Scroll velocity
     */
    getVelocity() {
        return this._scroll.particle.getVelocity1D();
    }

    /**
     * Get the current energy of the scrolling particle.
     *
     * @return {Number} Energy
     */
    getEnergy() {
        return this._scroll.particle.getEnergy();
    }

    /**
     * Set the scrolling velocity.
     *
     * @param {Number} velocity New scroll velocity
     * @return {ScrollController} this
     */
    setVelocity(velocity) {
        return this._scroll.particle.setVelocity1D(velocity);
    }

    /**
     * Applies a permanent scroll-force (delta) until it is released.
     * When the cumulative scroll-offset lies outside the allowed bounds
     * a strech effect is used, and the offset beyond the bounds is
     * substracted by halve. This function should always be accompanied
     * by a call to `releaseScrollForce`.
     *
     * This method is used for instance when using touch gestures to move
     * the scroll offset and corresponds to the `touchstart` event.
     *
     * @param {Number} delta Starting scroll-delta force to apply
     * @return {ScrollController} this
     */
    applyScrollForce(delta) {
        this.halt();
        if (this._scroll.scrollForceCount === 0) {
            this._scroll.scrollForceStartItem = this.options.alignment ? this.getLastVisibleItem() : this.getFirstVisibleItem();
        }
        this._scroll.scrollForceCount++;
        this._scroll.scrollForce += delta;
        this._eventOutput.emit((this._scroll.scrollForceCount === 1) ? 'swipestart' : 'swipeupdate', {
            target: this,
            total: this._scroll.scrollForce,
            delta: delta
        });
        return this;
    }

    /**
     * Updates a existing scroll-force previously applied by calling
     * `applyScrollForce`.
     *
     * This method is used for instance when using touch gestures to move
     * the scroll offset and corresponds to the `touchmove` event.
     *
     * @param {Number} prevDelta Previous delta
     * @param {Number} newDelta New delta
     * @return {ScrollController} this
     */
    updateScrollForce(prevDelta, newDelta) {
        this.halt();
        newDelta -= prevDelta;
        this._scroll.scrollForce += newDelta;
        this._eventOutput.emit('swipeupdate', {
            target: this,
            total: this._scroll.scrollForce,
            delta: newDelta
        });
        return this;
    }

    /**
     * Releases a scroll-force and sets the velocity.
     *
     * This method is used for instance when using touch gestures to move
     * the scroll offset and corresponds to the `touchend` event.
     *
     * @param {Number} delta Scroll delta to release
     * @param {Number} [velocity] Velocity to apply after which the view keeps scrolling
     * @return {ScrollController} this
     */
    releaseScrollForce(delta, velocity, detectSwipes) {
        this.halt();
        if (this._scroll.scrollForceCount === 1) {
            var scrollOffset = this._calcScrollOffset();
            this._setParticle(scrollOffset, velocity, 'releaseScrollForce');
            this._scroll.pe.wake();
            this._scroll.scrollForce = 0;
            this._scroll.scrollDirty = true;
            if (this._scroll.scrollForceStartItem && this.options.paginated && (this.options.paginationMode === PaginationMode.PAGE)) {
                var item = this.options.alignment ? this.getLastVisibleItem(true) : this.getFirstVisibleItem(true);
                if (item) {
                    if (item.renderNode !== this._scroll.scrollForceStartItem.renderNode) {
                        this.goToRenderNode(item.renderNode);
                    }
                    else if (detectSwipes && this.options.paginationEnergyThreshold && (Math.abs(this._scroll.particle.getEnergy()) >= this.options.paginationEnergyThreshold)) {
                        velocity = velocity || 0;
                        if ((velocity < 0) && item._node._next && item._node._next.renderNode) {
                            this.goToRenderNode(item._node._next.renderNode);
                        }
                        else if ((velocity >= 0) && item._node._prev && item._node._prev.renderNode) {
                            this.goToRenderNode(item._node._prev.renderNode);
                        }
                    }
                    else {
                        this.goToRenderNode(item.renderNode);
                    }
                }
            }
            this._scroll.scrollForceStartItem = undefined;
            this._scroll.scrollForceCount--;
            this._eventOutput.emit('swipeend', {
                target: this,
                total: delta,
                delta: 0,
                velocity: velocity
            });
        }
        else {
            this._scroll.scrollForce -= delta;
            this._scroll.scrollForceCount--;
            this._eventOutput.emit('swipeupdate', {
                target: this,
                total: this._scroll.scrollForce,
                delta: delta
            });
        }
        return this;
    }

    /**
     * Get the spec (size, transform, etc..) for the given renderable or
     * Id.
     *
     * @param {Renderable|String} node Renderabe or Id to look for.
     * @param {Bool} normalize When set to `true` normalizes the origin/align into the transform translation (default: `false`).
     * @return {Spec} spec or undefined
     */
    getSpec(node, normalize) {
        var spec = super.getSpec(...arguments);
        if (spec && this._isSequentiallyScrollingOptimized()) {
            spec = {
                origin: spec.origin,
                align: spec.align,
                opacity: spec.opacity,
                size: spec.size,
                renderNode: spec.renderNode,
                transform: spec.transform
            };
            var translate = [0, 0, 0];
            translate[this._direction] = this._scrollOffsetCache + this._scroll.groupStart;
            spec.transform = Transform.thenMove(spec.transform, translate);
        }
        return spec;
    }

    /**
     * Executes the layout and updates the state of the scrollview.
     */
    _layout(size, scrollOffset, nested) {

        // Track the number of times the layout-function was executed
        this._debug.layoutCount++;
        //_log.call(this, 'Layout, scrollOffset: ', scrollOffset, ', particle: ', this._scroll.particle.getPosition1D());

        // Determine start & end
        var scrollStart = 0 - Math.max(this.options.extraBoundsSpace[0], 1);
        var scrollEnd = size[this._direction] + Math.max(this.options.extraBoundsSpace[1], 1);
        if (this.options.paginated && (this.options.paginationMode === PaginationMode.PAGE)) {
            scrollStart = scrollOffset - this.options.extraBoundsSpace[0];
            scrollEnd = scrollOffset + size[this._direction] + this.options.extraBoundsSpace[1];
            if ((scrollOffset + size[this._direction]) < 0) {
                scrollStart += size[this._direction];
                scrollEnd += size[this._direction];
            }
            else if ((scrollOffset - size[this._direction]) > 0) {
                scrollStart -= size[this._direction];
                scrollEnd -= size[this._direction];
            }
        } else if(this.options.nativeScroll){
            scrollStart = 0;
        }
        if (this.options.layoutAll) {
            scrollStart = -1000000;
            scrollEnd = 1000000;
        }
        var layoutScrollOffset = this.options.alignment ? (scrollOffset + size[this._direction]) : scrollOffset;

        // Prepare for layout
        var layoutContext = this._nodes.prepareForLayout(
            this._viewSequence,     // first node to layout
            this._nodesById, {      // so we can do fast id lookups
                size: size,
                direction: this._direction,
                reverse: this.options.alignment ? true : false,
                scrollOffset: layoutScrollOffset,
                scrollStart: scrollStart,
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
        this._scroll.unnormalizedScrollOffset = scrollOffset;

        // Call post-layout function
        if (this._postLayout) {
            this._postLayout(size, scrollOffset);
        }

        // Mark non-invalidated nodes for removal
        this._nodes.removeNonInvalidatedNodes(this.options.flowOptions.removeSpec);

        // Check whether the bounds have been reached
        //var oldBoundsReached = this._scroll.boundsReached;
        this._calcBounds(size, scrollOffset);
        //if (oldBoundsReached !== this._scroll.boundsReached) {
        //    _log.call(this, 'bounds reached changed (', oldBoundsReached, ' != ', this._scroll.boundsReached, ')');
        //}

        // Update scroll-to spring
        this._calcScrollToOffset(size, scrollOffset);

        // When pagination is enabled, snap to page
        this._snapToPage();


        // Normalize scroll offset so that the current viewsequence node is as close to the
        // top as possible and the layout function will need to process the least amount
        // of renderables.
        scrollOffset = this._normalizeViewSequence(size, scrollOffset);



        // If the bounds have changed, and the scroll-offset would be different
        // than before, then re-layout entirely using the new offset.
        var newScrollOffset = this._calcScrollOffset(true);
        if (!nested && (newScrollOffset !== scrollOffset)) {
            //_log.call(this, 'offset changed, re-layouting... (', scrollOffset, ' != ', newScrollOffset, ')');
            return this._layout(size, newScrollOffset, true);
        }


        // Update spring
        this._updateSpring();

        // Cleanup any nodes in case of a VirtualViewSequence
        this._nodes.removeVirtualViewSequenceNodes();

        // Calculate scroll-length and use that as the true-size (height)
        if (this.options.size && (this.options.size[this._direction] === true)) {
            var scrollLength = 0;
            var node = this._nodes.getStartEnumNode();
            while (node) {
                if (node._invalidated && node.scrollLength) {
                    scrollLength += node.scrollLength;
                }
                node = node._next;
            }
            this._size = this._size || [0, 0];
            this._size[0] = this.options.size[0];
            this._size[1] = this.options.size[1];
            this._size[this._direction] = scrollLength;
        }

        return scrollOffset;
    }

    /**
     * Inner render function of the Group
     */
    _innerRender() {
        var specs = this._specs;
        for (var i3 = 0, j3 = specs.length; i3 < j3; i3++) {
            if (specs[i3].renderNode) {
                specs[i3].target = specs[i3].renderNode.render();
            }
        }

        // Add our cleanup-registration id also to the list, so that the
        // cleanup function is called by famo.us when the LayoutController is
        // removed from the render-tree.
        if (!specs.length || (specs[specs.length-1] !== this._cleanupRegistration)) {
            specs.push(this._cleanupRegistration);
        }
        return specs;
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
        var size = context.size;

        // Update debug info
        this._debug.commitCount++;

        // Reset the flow-state when requested
        if (this._resetFlowState) {
            this._resetFlowState = false;
            this._isDirty = true;
            this._nodes.removeAll();
        }
        //Calculate the scrollOffset, but don't store the variable if using native scroll
        var scrollOffset = this._calcScrollOffset(true, true);
        if(this.options.nativeScroll){
            if(this.group._element){
                scrollOffset = this.group._element.scrollTop + this.options.extraBoundsSpace[0] - this._scroll.groupStart;
            }
        }

        if (this._scrollOffsetCache === undefined) {
            this._scrollOffsetCache = scrollOffset;
        }

        // When the size or layout function has changed, reflow the layout
        var emitEndScrollingEvent = false;
        var emitScrollEvent = false;
        var eventData;
        if (size[0] !== this._contextSizeCache[0] ||
            size[1] !== this._contextSizeCache[1] ||
            this._isDirty ||
            this._reLayout ||
            this._scroll.scrollDirty ||
            this._nodes._trueSizeRequested ||
            this.options.alwaysLayout ||
            this._scrollOffsetCache !== scrollOffset) {

            if(this._reLayout){
                this._reLayout = false;
            }

            // Prepare event data
            eventData = {
                target: this,
                oldSize: this._contextSizeCache,
                size: size,
                oldScrollOffset: -(this._scrollOffsetCache + this._scroll.groupStart),
                scrollOffset: -(scrollOffset + this._scroll.groupStart)
            };

            // When scroll-offset has changed, emit scroll-start and scroll events
            if (this._scrollOffsetCache !== scrollOffset) {
                if (!this._scroll.isScrolling) {
                    this._scroll.isScrolling = true;
                    this._eventOutput.emit('scrollstart', eventData);
                }
                emitScrollEvent = true;
            }
            else if (this._scroll.isScrolling && !this._scroll.scrollForceCount) {
                emitEndScrollingEvent = true;

            }

            this._eventOutput.emit('layoutstart', eventData);





            // Update state
            this._contextSizeCache[0] = size[0];
            this._contextSizeCache[1] = size[1];



            // Perform layout
            scrollOffset = this._layout(size, scrollOffset);
            this._scrollOffsetCache = scrollOffset;

            /* Depending on whether an inserted node is in view or not, we might have to enable flowing mode */

            if(this._dirtyRenderables.length){
                /*this._dirtyRenderables.thisTick = this._dirtyRenderables.thisTick.concat(this._dirtyRenderables.nextTick);*/
                this._isDirty = !this._dirtyRenderables.every(function(dirtyRenderable){return !this._nodes.isNodeInCurrentBuild(dirtyRenderable)}.bind(this));
                this._dirtyRenderables = [];

            }

            // When the layout has changed, and we are not just scrolling,
            // disable the locked state of the layout-nodes so that they
            // can freely transition between the old and new state.
            if (this.options.flow && (this._isDirty ||
                (this.options.flowOptions.reflowOnResize &&
                ((size[0] !== this._contextSizeCache[0]) ||
                (size[1] !== this._contextSizeCache[1]))))) {
                var node = this._nodes.getStartEnumNode();
                while (node) {
                    node.releaseLock(true);
                    node = node._next;
                }
            }

            this._isDirty = false;
            this._scroll.scrollDirty = false;



            // Emit end event
            eventData.scrollOffset = -(this._scrollOffsetCache + this._scroll.groupStart);
        }
        else {
            if (this._scroll.isScrolling && !this._scroll.scrollForceCount) {
                emitEndScrollingEvent = true;
            }
            /* Reset the ensureVisibleRenderNode to prevent unwanted behaviour when doing replace and not finding the renderable */
            this._scroll.ensureVisibleRenderNode = undefined;
        }

        // Update output and optionally emit event
        var groupTranslate = this._scroll.groupTranslate;
        groupTranslate[0] = 0;
        groupTranslate[1] = 0;
        groupTranslate[2] = 0;
        groupTranslate[this._direction] = -this._scroll.groupStart - scrollOffset;
        var sequentialScrollingOptimized = this._isSequentiallyScrollingOptimized();
        var result = this._nodes.buildSpecAndDestroyUnrenderedNodes(sequentialScrollingOptimized ? groupTranslate : undefined);
        this._specs = result.specs;
        if (!this._specs.length) {
            this._scroll.groupStart = 0;
        }
        if (eventData) { // eventData is only used here to check whether there has been a re-layout
            this._eventOutput.emit('layoutend', eventData);
        }
        if (result.modified) {
            this._eventOutput.emit('reflow', {
                target: this
            });
        }

        // View has been scrolled, emit event
        if (emitScrollEvent) {
            this._eventOutput.emit('scroll', eventData);
        }

        // Check whether the current page has changed
        if (eventData) { // eventData is only used here to check whether there has been a re-layout
            var visibleItem = this.options.alignment ? this.getLastVisibleItem() : this.getFirstVisibleItem();
            if ((visibleItem && !this._visibleItemCache) || (!visibleItem && this._visibleItemCache) ||
                (visibleItem && this._visibleItemCache && (visibleItem.renderNode !== this._visibleItemCache.renderNode))) {
                this._eventOutput.emit('pagechange', {
                    target: this,
                    oldViewSequence: this._visibleItemCache ? this._visibleItemCache.viewSequence : undefined,
                    viewSequence: visibleItem ? visibleItem.viewSequence : undefined,
                    oldIndex: this._visibleItemCache ? this._visibleItemCache.index : undefined,
                    index: visibleItem ? visibleItem.index : undefined,
                    renderNode: visibleItem ? visibleItem.renderNode : undefined,
                    oldRenderNode: this._visibleItemCache ? this._visibleItemCache.renderNode : undefined
                });
                this._visibleItemCache = visibleItem;
            }
        }

        if(this._stickBottom){
            var element = this.group._element;
            if(element){
                element.scrollTop = element.scrollHeight;
            }
        }

        // Emit end scrolling event
        if (emitEndScrollingEvent) {
            this._scroll.isScrolling = false;
            this._scroll.scrollDirty = true;
            eventData = {
                target: this,
                oldSize: size,
                size: size,
                oldScrollOffset: -(this._scroll.groupStart + scrollOffset),
                scrollOffset: -(this._scroll.groupStart + scrollOffset)
            };
            this._eventOutput.emit('scrollend', eventData);
        }

        // When renderables are layed out sequentiall (e.g. a ListLayout or
        // CollectionLayout), then offset the renderables onto the Group
        // and move the group offset instead. This creates a very big performance gain
        // as the renderables don't have to be repositioned for every change
        // to the scrollOffset. For layouts that don't layout sequence, disable
        // this behavior as it will be decremental to the performance.
        var transform = context.transform;
        if (sequentialScrollingOptimized ) {
            var windowOffset = scrollOffset + this._scroll.groupStart;
            var translate = [0, 0, 0];
            if(!this.options.nativeScroll){
                translate[this._direction] = windowOffset;
            } else if(this.group._element) {
                this.group._element.scrollTop = windowOffset - this.options.extraBoundsSpace[0];
            }
            transform = Transform.thenMove(transform, translate);
        }

        // Return the spec
        return {
            transform: transform,
            size: size,
            opacity: context.opacity,
            origin: context.origin,
            target: this.group.render()
        };
    }

    replace(indexOrId, renderable, noAnimation) {
        var sequence;
        //TODO: Check when _nodesById is used as well
        if (!this._nodesById){
            sequence = this._viewSequence.findByIndex(indexOrId);
            var oldRenderable = sequence.get();
            if (oldRenderable !== renderable && noAnimation && oldRenderable && (this._scroll.ensureVisibleRenderNode === oldRenderable)) {
                this._scroll.ensureVisibleRenderNode = renderable;
            }
        }
        return super.replace(indexOrId, renderable, noAnimation, sequence);
    }

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    render render() {
        if (this.container) {
            return this.container.render.apply(this.container, arguments);
        }
        else {
            return this.id;
        }
    }
}
