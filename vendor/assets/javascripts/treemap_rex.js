/**
 * jQuery Treemap v1.0.0
 *
 * A (simple) jQuery plugin for generating treemaps.
 *
 * Copyright (c) Rex McConnell (http://rexmac.com/)
 *
 * Licensed under the MIT license (http://rexmac.com/license/mit.txt)
 *
 * This plugin was heavily inspired by and borrows a lot of code from the
 * following plugins:
 *   - https://github.com/lrgalego/jquery-treemap
 *   - http://www.jnathanson.com/blog/client/jquery/heatcolor/index.cfm
 */
;(function($, window, document, undefined) {
    'use strict';

    function Rectangle(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    Rectangle.prototype.style = function() {
        return {
            top: this.y,
            left: this.x,
            width: this.width,
            height: this.height
        };
    };

    var settings,
    methods = {
        init: function(options) {
            settings = $.extend({}, $.fn.treemap.defaults, options);

            return this.each(function() {
                var $el = $(this),
                    data = $el.data('treemap'),
                    $div, r, nodes, i, n, node, $node, min, max, colors, $legend;

                if(data) { // Treemap has already been initialized
                    return;
                }

                if(settings.data === undefined && $el.is('ul')) {
                    settings.data = [];
                    $el.children().each(function() {
                        var $li = $(this);
                        settings.data.push({
                            label: $li.html(),
                            value: parseInt($li.attr('value'), 10)
                        });
                    });
                }
                if(undefined === settings.data) { // Treemap requires data
                    return;
                }

                // Create treemap div
                $div = $('<div/>').addClass('treemap').css('position', 'relative');
                $div.css({
                    width: settings.width,
                    height: settings.height
                });

                // Create rectangle representing treemap area
                r = new Rectangle(0, 0, $div.width(), $div.height());

                // Make copy of settings.data to avoid modifying the original
                nodes = JSON.parse(JSON.stringify(settings.data));

                // Sort nodes by value in descending order
                nodes.sort(function(a, b) {
                    return b.value - a.value;
                });

                // Tessellate treemap rectangle
                helpers.tessellate(nodes, r);

                // Determine begin and end colors in HSB
                colors = [helpers.hex2hsb(settings.colors[0]), helpers.hex2hsb(settings.colors[1])];

                // Create treemap with nodes represented by colored div elements
                for(i = 0, n = nodes.length, min = nodes[n-1].value, max = nodes[0].value; i < n; ++i) {
                    node = nodes[i];
                    $node = $('<div/>').addClass('treemap-node');
                    if(node.id) { $node.attr('id', node.id); }
                    if(node['class']) { $node.addClass(node['class']); }
                    $node.html(node.label);
                    $node.data('value', node.value);
                    $node.css($.extend(node.bounds.style(), {
                        'position': 'absolute',
                        'backgroundColor': '#' + helpers.rgb2hex(helpers.hsb2rgb(helpers.lerpHsb(node.value, max, colors[0], colors[1])))
                    }));
                    $node.appendTo($div);
                }

                if($el.is('ul')) {
                    $el.after($div).hide();
                } else {
                    $div.appendTo($el);
                }

                if(settings.legend) {
                    $legend = $('<div/>').addClass('treemap-legend');
                    $legend.append($('<span/>').addClass('treemap-legend-begin').text(settings.legendLabels[0]));
                    $legend.append($('<span/>').addClass('treemap-legend-end').text(settings.legendLabels[1]));
                    if(settings.legendPosition === 'top') {
                        $legend.insertBefore($div);
                    } else {
                        $legend.insertAfter($div);
                    }
                }

                $el.data('treemap', {
                    treemap: $div,
                    legend: $legend
                });
            });
        },
        destroy: function() {
            return this.each(function() {
                var $el = $(this),
                    data = $el.data('treemap');

                if(!data) { // Nothing to destroy(?)
                    return;
                }

                if(data.legend) { data.legend.remove(); }
                data.treemap.remove();
                $el.removeData('treemap');

                if($el.is('ul')) { $el.show(); }
            });
        }
    },
    helpers = {
        // Recursively tessellate rectangle into rectangles based on values of nodes.
        // Store bounds of each node in node[i].bounds.
        tessellate: function(nodes, rectangle) {
            if(nodes.length === 0) { return; }
            if(nodes.length === 1) {
                nodes[0].bounds = rectangle;
                return;
            }

            var halves = helpers.splitNodes(nodes),
                leftSum = helpers.sumNodeValues(halves.left),
                rightSum = helpers.sumNodeValues(halves.right),
                total = leftSum + rightSum,
                midPoint = 0,
                vertical = false;

            if(total > 0) {
                if(rectangle.width > rectangle.height) {
                    midPoint = Math.round((leftSum * rectangle.width) / total);
                } else {
                    vertical = true;
                    midPoint = Math.round((leftSum * rectangle.height) / total);
                }
            }

            if(vertical === false) {
                helpers.tessellate(halves.left, new Rectangle(rectangle.x, rectangle.y, midPoint, rectangle.height));
                helpers.tessellate(halves.right, new Rectangle(rectangle.x + midPoint, rectangle.y, rectangle.width - midPoint, rectangle.height));
            } else {
                helpers.tessellate(halves.left, new Rectangle(rectangle.x, rectangle.y, rectangle.width, midPoint));
                helpers.tessellate(halves.right, new Rectangle(rectangle.x, rectangle.y + midPoint, rectangle.width, rectangle.height - midPoint));
            }
        },
        // Linear interpolation of HSB color values
        lerpHsb: function(value, max, begin, end) {
            return {
                h: begin.h + (end.h - begin.h) * value / max,
                s: begin.s + (end.s - begin.s) * value / max,
                b: begin.b + (end.b - begin.b) * value / max
            };
        },
        // Expand 3-digit hex color notation to 6-digit color notation, i.e. 39C -> 3399CC
        expandHex: function(hex) {
            hex = hex.replace(/[^A-F0-9]/ig, '');
            if(!hex) { return null; }
            if(hex.length === 3) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; }
            return hex.length === 6 ? hex : null;
        },
        // Convert color from HEX notation to HSB notation
        hex2hsb: function(hex) {
            var hsb = helpers.rgb2hsb(helpers.hex2rgb(helpers.expandHex(hex)));
            if(hsb.s === 0) { hsb.h = 360; }
            return hsb;
        },
        // Convery color from HEX notation to RGB notation
        hex2rgb: function(hex) {
            hex = parseInt(helpers.expandHex(hex), 16);
            return {
                r: hex >> 16,
                g: (hex & 0x00FF00) >> 8,
                b: (hex & 0x0000FF)
            };
        },
        // Convert color from HSB notation to RGB notation
        hsb2rgb: function(hsb) {
            var rgb = {r: 0, g: 0, b: 0},
                h = Math.round(hsb.h),
                s = Math.round(hsb.s * 255 / 100),
                b = Math.round(hsb.b * 255 / 100),
                t1, t2, t3;

            if(s === 0) {
                rgb.r = rgb.g = rgb.b = b;
            } else {
                t1 = b;
                t2 = (255 - s) * b / 255;
                t3 = (t1 - t2) * (h % 60) / 60;
                if(h === 360) { h = 0; }
                if(h < 60) {
                    rgb.r = t1;
                    rgb.g = t2 + t3;
                    rgb.b = t2;
                } else if(h < 120) {
                    rgb.r = t1 - t3;
                    rgb.g = t1;
                    rgb.b = t2;
                } else if(h < 180) {
                    rgb.r = t2;
                    rgb.g = t1;
                    rgb.b = t2 + t3;
                } else if(h < 240) {
                    rgb.r = t2;
                    rgb.g = t1 - t3;
                    rgb.b = t1;
                } else if(h < 300) {
                    rgb.r = t2 + t3;
                    rgb.g = t2;
                    rgb.b = t1;
                } else if(h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3;
                }
            }

            return {
                r: Math.round(rgb.r),
                g: Math.round(rgb.g),
                b: Math.round(rgb.b)
            };
        },
        // Convert color from RGB notation to hexidecimal notation
        rgb2hex: function(rgb) {
            var hex = [
                rgb.r.toString(16),
                rgb.g.toString(16),
                rgb.b.toString(16)
            ];
            $.each(hex, function(k, v) {
                if(v.length === 1) { hex[k] = '0' + v; }
            });
            return hex.join('');
        },
        // Convert color from RGB notation to HSB notation
        rgb2hsb: function(rgb) {
            var hsb = {h: 0, s: 0, b: 0},
                min = Math.min(rgb.r, rgb.g, rgb.b),
                max = Math.max(rgb.r, rgb.g, rgb.b),
                delta = max - min;
            hsb.b = max;
            hsb.s = max !== 0 ? 255 * delta / max : 0;
            if(hsb.s !== 0) {
                if(rgb.r === max) { hsb.h = (rgb.g - rgb.b) / delta; }
                else if(rgb.g === max) { hsb.h = 2 + (rgb.b - rgb.r) / delta; }
                else { hsb.h = 4 + (rgb.r - rgb.g) / delta; }
            } else {
                hsb.h = -1;
            }
            hsb.h *= 60;
            if(hsb.h < 0) { hsb.h += 360; }
            hsb.s *= 100/255;
            hsb.b *= 100/255;

            return hsb;
        },
        splitNodes: function(nodes) {
            var half = helpers.sumNodeValues(nodes) / 2,
                c = 0, i = 0, n = nodes.length;
            for(; i < n; ++i) {
                if(i > 0 && (c + nodes[i].value > half)) { break; }
                c += nodes[i].value;
            }

            return {
                left: nodes.slice(0, i),
                right: nodes.slice(i)
            };
        },
        sumNodeValues: function(nodes) {
            var sum = 0, i = 0, n = nodes.length;
            for(; i < n; ++i) {
                sum += nodes[i].value;
            }
            return sum;
        }
    };

    $.fn.treemap = function(method) {
        if(methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method \'' + method + '\' does not exist on jquery.treemap');
        }
    };

    $.fn.treemap.defaults = {
        colors: ['#f00', '#0f0'],
        legend: false,
        legendLabels: ['Low', 'High'],
        legendPosition: 'bottom',
        width: 500,
        height: 300
    };
}(jQuery, window, document));
