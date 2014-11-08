/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define*/

/**
 * Lays out a collection of renderables from top to bottom or left to right.
 *
 * |options|type|description|
 * |---|---|---|
 * |`[itemSize]`|Number|Height or width in pixels of the list-item|
 *
 * Example:
 *
 * ```javascript
 * var ListLayout = require('famous-flex/layouts/ListLayout');
 *
 * var scrollController = new ScrollController({
 *   layout: ListLayout,
 *   layoutOptions: {
 *     itemSize: 40,         // item has height of 40 pixels
 *   },
 *   dataSource: [
 *     new Surface({content: 'item 1'}),
 *     new Surface({content: 'item 2'}),
 *     new Surface({content: 'item 3'})
 *   ]
 * })
 * ```
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var Utility = require('famous/utilities/Utility');

    // Define capabilities of this layout function
    var capabilities = {
        sequence: true,
        direction: [Utility.Direction.Y, Utility.Direction.X],
        scrolling: true,
        trueSize: true,
        sequentialScrollingOptimized: true
    };

    // Cached data
    var set = {
        size: [0, 0],
        translate: [0, 0, 0]
    };

    // Layout function
    function ListLayout(context, options) {

        // Prepare
        var size = context.size;
        var direction = context.direction;
        var offset = context.scrollOffset;
        var node;
        var nodeSize;
        var itemSize;

        // Determine item-size or use true=size
        if ((options.itemSize === true) || !options.hasOwnProperty('itemSize')) {
            itemSize = true;
        }
        else {
            itemSize = (options.itemSize === undefined) ? size[direction] : options.itemSize;
        }

        // prepare set
        set.size[0] = size[0];
        set.size[1] = size[1];
        set.translate[0] = 0;
        set.translate[1] = 0;
        set.translate[2] = 0;

        // Process all next nodes
        while (offset < context.scrollEnd) {
            node = context.next();
            if (!node) {
                break;
            }
            nodeSize = (itemSize === true) ? context.resolveSize(node, size)[direction] : itemSize;
            set.size[direction] = nodeSize;
            set.translate[direction] = offset;
            set.scrollLength = nodeSize;
            context.set(node, set);
            offset += nodeSize;
        }

        // Process previous nodes
        offset = context.scrollOffset;
        while (offset > context.scrollStart) {
            node = context.prev();
            if (!node) {
                break;
            }
            nodeSize = (itemSize === true) ? context.resolveSize(node, size)[direction] : itemSize;
            offset -= nodeSize;
            set.size[direction] = nodeSize;
            set.translate[direction] = offset;
            set.scrollLength = nodeSize;
            context.set(node, set);
        }
    }

    ListLayout.Capabilities = capabilities;
    module.exports = ListLayout;
});
