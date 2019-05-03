 (function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};

 	// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;

 	// expose the module cache
 	__webpack_require__.c = installedModules;

 	// define getter function for harmony exports
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};

 	// define __esModule on exports
 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	// create a fake namespace object
 	// mode & 1: value is a module id, require it
 	// mode & 2: merge all properties of value into the ns
 	// mode & 4: return value when already ns object
 	// mode & 8|1: behave like require
 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};

 	// getDefaultExport function for compatibility with non-harmony modules
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	// Object.prototype.hasOwnProperty.call
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	// __webpack_public_path__
 	__webpack_require__.p = "";


 	// Load entry module and return exports
 	return __webpack_require__(__webpack_require__.s = 0);
 })
/************************************************************************/
 ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3gtd_geomap = __webpack_require__(1);

var _d3gtd_visblock = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var D3gtd = function () {
	function D3gtd(options) {
		var _this = this;

		_classCallCheck(this, D3gtd);

		if (!d3) {
			throw "D3 js version 5 must be defined globally";
		}
		this.options = options;
		this.geomap = new _d3gtd_geomap.D3gtd_map(options);

		Promise.all([d3.json('./world.json'), d3.json('./countryCodeMapping.json'), d3.csv('./gtdata_filter.csv')]).then(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 3),
			    world = _ref2[0],
			    countriesMapping = _ref2[1],
			    gt_data = _ref2[2];

			_this.nonGroupedData = gt_data;
			_this.groupedData = d3.group(gt_data, function (d) {
				return d.country;
			});
			_this.world = world.features;
			_this.countriesMapping = countriesMapping;
			_this.filterData();
			_this.geomap.init(_this.world, _this.maxValue, _this.dateInterval);
			_this.visualisation = new _d3gtd_visblock.D3gtd_visblock({
				column: options.column,
				donut1: options.donut1,
				donut2: options.donut2,
				dateInterval: _this.dateInterval
			});
			_this.visualisation.setTimeInterval(_this.timeInterval);
			_this.visualisation.setCountry({
				id: 'worldwide',
				properties: {
					name: 'worldwide'
				}
			}, _this.patchupChartsData());
			_this.acticeVisColumn = 0; // Only two countries can be select for vises
			_this.visualisation.on('clickYear', function (d) {
				var start = new Date();
				start.setFullYear(parseInt(d));
				start.setMonth(0);
				start.setDate(1);
				var end = new Date();
				end.setFullYear(parseInt(d));
				end.setMonth(11);
				end.setDate(31);
				_this.updateTimeInterval([start.getTime(), end.getTime()]);
				_this.geomap.setSliderInterval([start.getTime(), end.getTime()]);
			});
		});

		this.geomap.on('clickCountry', function (d) {
			_this.visualisation.setCountry(d, _this.patchupChartsData(d));
			// this.visualisations[this.acticeVisColumn].setCountry(d, this.patchupChartsData(d));
			// this.acticeVisColumn = (this.acticeVisColumn + 1) % 2;
		});
		this.geomap.on('changeInterval', function (values) {
			_this.updateTimeInterval(values);
		});
	}

	_createClass(D3gtd, [{
		key: 'updateTimeInterval',
		value: function updateTimeInterval(values) {
			var _this2 = this;

			this.filterData([parseInt(values[0]), parseInt(values[1])]);
			this.geomap.update(this.world, this.maxValue);
			this.visualisation.setTimeInterval(this.timeInterval);
			var countries = this.visualisation.getCountries();
			countries.forEach(function (country) {
				country && _this2.visualisation.setCountry(country, _this2.patchupChartsData(country.id == 'worldwide' ? null : country));
			});
		}
	}, {
		key: 'filterData',
		value: function filterData(timeInterval) {
			var _this3 = this;

			if (!timeInterval) {
				this.dateInterval = [new Date(0), new Date(0)];
				this.groupedData.forEach(function (countryEvents) {
					countryEvents.forEach(function (event) {
						var date = getDateFromEvent(event);
						_this3.dateInterval[0] = Math.min(_this3.dateInterval[0], date);
						_this3.dateInterval[1] = Math.max(_this3.dateInterval[1], date);
					});
				});
				timeInterval = this.dateInterval;
			}
			this.timeInterval = timeInterval;
			this.maxValue = 0;
			this.world.forEach(function (country) {
				var summ = 0;
				var summDeaths = 0;
				var countryCodes = _this3.countriesMapping[country.id.toLowerCase()];
				countryCodes && countryCodes.forEach(function (code) {
					var amount = _this3.groupedData.get(code.toString()).filter(function (event) {
						return timeInterval[0] <= getDateFromEvent(event) && timeInterval[1] >= getDateFromEvent(event);
					});
					summ += amount && amount.length;
					amount && amount.forEach(function (event) {
						summDeaths += event.nkill ? parseInt(event.nkill) : 0;
					});
				});
				country.count = summ;
				country.countDeaths = summDeaths;
				_this3.maxValue = Math.max(country.count, _this3.maxValue);
			});
		}
	}, {
		key: 'patchupChartsData',
		value: function patchupChartsData(d) {
			var _this4 = this;

			if (!d) {
				return this.nonGroupedData.filter(function (event) {
					return _this4.timeInterval[0] <= getDateFromEvent(event) && _this4.timeInterval[1] >= getDateFromEvent(event);
				}).map(function (event) {
					return Object.assign(event, { date: getDateFromEvent(event) });
				});
			}
			var countryCodes = this.countriesMapping[d.id.toLowerCase()];
			var events = [];
			countryCodes && countryCodes.forEach(function (code) {
				events = events.concat(_this4.groupedData.get(code.toString()).filter(function (event) {
					return _this4.timeInterval[0] <= getDateFromEvent(event) && _this4.timeInterval[1] >= getDateFromEvent(event);
				}).map(function (event) {
					return Object.assign(event, { date: getDateFromEvent(event) });
				}));
			});
			return events;
		}
	}]);

	return D3gtd;
}();

// Create a new date from a string, return as a timestamp.


function timestamp(str) {
	return new Date(str).getTime();
}
// Create a list of day and month names.
var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDateFromEvent(event) {
	var date = new Date(event.iyear);
	date.setMonth(+event.imonth - 1);
	date.setDate(+event.iday);
	return date;
}

// Export globally
window.D3gtd = D3gtd;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.D3gtd_map = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nouislider = __webpack_require__(2);

var _nouislider2 = _interopRequireDefault(_nouislider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dispatcher = d3.dispatch('clickCountry', 'changeInterval', 'mouseover', 'mousemove', 'mouseleave');

var D3gtd_map = exports.D3gtd_map = function () {
  function D3gtd_map(options) {
    _classCallCheck(this, D3gtd_map);

    this.options = options;
    this.container = d3.select('#' + options.mapId).classed('d3gtc-container', true).style('position', 'relative').style('overflow', 'hidden');

    this.width = this.container.node().getBoundingClientRect().width;
    this.height = this.width / 1.85;
    this.world = undefined; // Contains visible data
    var scale0 = this.width / 2 / Math.PI;

    this.projection = d3.geoMercator().scale(scale0).translate([this.width / 2, this.height / 1.55]);

    this.container.append('div').classed('d3gtc-geomap', true).style('border', '1px solid #eee').style('overflow', 'hidden').append("svg").attr("width", this.width).attr("height", this.height);

    this.container.append('div').style('padding-right', '20px').style('padding-left', '20px').classed('d3gtc-slider', true);

    this.geomap = this.container.select('.d3gtc-geomap').select('svg');
    this.legendContainer = this.container.select('.d3gtc-geomap').append('div').classed('d3gtc-geomapLegend', true).style('position', 'absolute');
    this.legendContainer.append('div').classed('d3gtc-geomapLegend-title', true).style('font-size', '12px').style('margin-bottom', '6px').text('Number of attacks');
  }

  _createClass(D3gtd_map, [{
    key: 'init',
    value: function init(world, maxValue, dateInterval) {
      this.update(world, maxValue);
      this.initSlider(dateInterval);
    }
  }, {
    key: 'update',
    value: function update(world, maxValue) {
      var _this = this;

      var strokeOpacuty = 0.5;
      var hoverStrokeOpacuty = 1;
      var strokeColor = '#eee';
      var hoverStrokeColor = '#eee';
      var colorScale = d3.scaleQuantize().domain([0, maxValue * 0.3, maxValue]).range(['#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000']);
      // var colorScale = d3.scaleLinear()
      //   .domain([0, maxValue])
      //   .range(["#4cd137", "#c23616"]);
      var countries = this.geomap.selectAll('path').data(world);
      var tooltip = null;
      var tooltipMarkup = function tooltipMarkup(data) {
        return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + data.properties.name + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of attacks: <span>' + data.count + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of deaths: <span>' + data.countDeaths + '</span> \
                </div> \
              </div>';
      };
      countries.enter().append("path")
      // draw each country
      .attr("d", d3.geoPath(this.projection)).attr("stroke", strokeColor).attr('stroke-opacity', strokeOpacuty).style('cursor', 'pointer').on('mouseover', function (d) {
        d3.select(this).attr('stroke-opacity', hoverStrokeOpacuty).attr("stroke", hoverStrokeColor);
      }).on('mouseleave', function (d) {
        d3.select(this).attr('stroke-opacity', strokeOpacuty).attr("stroke", strokeColor);
      }).on('click', function (d) {
        dispatcher.call("clickCountry", _this, d);
      }).on('mouseover', function (d) {
        showTooltip(d);
      }).on('mousemove', function (d) {
        updateTooltipPosition(d);
      }).on('mouseleave', function (d) {
        clearTolltips();
      }).merge(countries).transition().duration(500).attr("fill", function (d) {
        return colorScale(d.count);
      });

      this.updateLegend(world, maxValue, colorScale);

      var showTooltip = function showTooltip(d) {
        if (!tooltipMarkup) return;
        tooltip = _this.container.append('div').attr('class', 'donut-tooltip').html(tooltipMarkup(d)).style('position', 'fixed').style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px').style('transform', 'translate(-50%, 20px)').style('z-index', 100);
      };

      var updateTooltipPosition = function updateTooltipPosition(data) {
        tooltip.style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px');
      };

      var clearTolltips = function clearTolltips() {
        tooltip.remove();
      };
    }
  }, {
    key: 'updateLegend',
    value: function updateLegend(world, maxValue, colorScale) {
      var range = colorScale.range();
      var thresholds = colorScale.thresholds();
      range = range.map(function (el, i) {
        var rObj = {};
        rObj.color = el;
        rObj.minValue = i === 0 ? 0 : thresholds[i - 1];
        rObj.maxValue = i === range.length - 1 ? maxValue : thresholds[i];
        return rObj;
      });
      var legendLines = this.legendContainer.selectAll('.d3gtc-geomapLegend-line').data(range);
      legendLines.enter().append("div").classed('d3gtc-geomapLegend-line', true).style('position', 'relative').style('padding-left', '15px').each(function (d) {
        d3.select(this).append('div').classed('d3gtc-geomapLegend-line-color', true).style('position', 'absolute').style('left', '0').style('top', '1px').style('width', '10px').style('height', '10px').style('background', function (d) {
          return d.color;
        });
        d3.select(this).append('div').classed('d3gtc-geomapLegend-line-text', true).style('font-size', '12px').html(function (d) {
          return Math.floor(d.minValue) + ' &ndash; ' + Math.floor(d.maxValue);
        });
      });
      legendLines.each(function (d) {
        d3.select(this).select('.d3gtc-geomapLegend-line-text').html(function (d) {
          return Math.floor(d.minValue) + ' &ndash; ' + Math.floor(d.maxValue);
        });
      });
    }
  }, {
    key: 'initSlider',
    value: function initSlider(dateInterval) {
      var _this2 = this;

      this.dateSlider = this.container.select('.d3gtc-slider').node();

      _nouislider2.default.create(this.dateSlider, {
        // Create two timestamps to define a range.
        range: {
          min: dateInterval[0],
          max: dateInterval[1]
        },
        connect: true,

        // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,

        // Two more timestamps indicate the handle starting positions.
        start: [dateInterval[0], dateInterval[1]]

        // No decimals
        // format: wNumb({
        // 	decimals: 0
        // })
      });

      var dateValuesDisplay = [document.getElementById(this.options.startDateTextId), document.getElementById(this.options.endDateTextId)];

      this.dateSlider.noUiSlider.on('update', function (values, handle) {
        d3.select(dateValuesDisplay[handle]).text(formatDate(new Date(+values[handle])));
      });
      this.dateSlider.noUiSlider.on('change', function (values, handle) {
        dispatcher.call("changeInterval", _this2, values);
      });
    }
  }, {
    key: 'setSliderInterval',
    value: function setSliderInterval(timeInterval) {
      this.dateSlider.noUiSlider.set(timeInterval);
    }
  }, {
    key: 'on',
    value: function on() {
      var value = dispatcher.on.apply(dispatcher, arguments);
      return value === dispatcher ? this : value;
    }
  }]);

  return D3gtd_map;
}();

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Create a string representation of the date.
function formatDate(date) {
  return date.getDate() + nth(date.getDate()) + " " + months[date.getMonth()] + " " + date.getFullYear();
}

// Append a suffix to dates.
// Example: 23 => 23rd, 1 => 1st.
function nth(d) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! nouislider - 13.1.4 - 3/20/2019 */
(function (factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
})(function () {
    "use strict";

    var VERSION = "13.1.4";

    //region Helper Methods

    function isValidFormatter(entry) {
        return (typeof entry === "undefined" ? "undefined" : _typeof(entry)) === "object" && typeof entry.to === "function" && typeof entry.from === "function";
    }

    function removeElement(el) {
        el.parentElement.removeChild(el);
    }

    function isSet(value) {
        return value !== null && value !== undefined;
    }

    // Bindable version
    function preventDefault(e) {
        e.preventDefault();
    }

    // Removes duplicates from an array.
    function unique(array) {
        return array.filter(function (a) {
            return !this[a] ? this[a] = true : false;
        }, {});
    }

    // Round a value to the closest 'to'.
    function closest(value, to) {
        return Math.round(value / to) * to;
    }

    // Current position of an element relative to the document.
    function offset(elem, orientation) {
        var rect = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var docElem = doc.documentElement;
        var pageOffset = getPageOffset(doc);

        // getBoundingClientRect contains left scroll in Chrome on Android.
        // I haven't found a feature detection that proves this. Worst case
        // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
            pageOffset.x = 0;
        }

        return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
    }

    // Checks whether a value is numerical.
    function isNumeric(a) {
        return typeof a === "number" && !isNaN(a) && isFinite(a);
    }

    // Sets a class and removes it after [duration] ms.
    function addClassFor(element, className, duration) {
        if (duration > 0) {
            addClass(element, className);
            setTimeout(function () {
                removeClass(element, className);
            }, duration);
        }
    }

    // Limits a value to 0 - 100
    function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }

    // Wraps a variable as an array, if it isn't one yet.
    // Note that an input array is returned by reference!
    function asArray(a) {
        return Array.isArray(a) ? a : [a];
    }

    // Counts decimals
    function countDecimals(numStr) {
        numStr = String(numStr);
        var pieces = numStr.split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }

    // http://youmightnotneedjquery.com/#add_class
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += " " + className;
        }
    }

    // http://youmightnotneedjquery.com/#remove_class
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
    }

    // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
    function hasClass(el, className) {
        return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    function getPageOffset(doc) {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
        var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft;
        var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop;

        return {
            x: x,
            y: y
        };
    }

    // we provide a function to compute constants instead
    // of accessing window.* as soon as the module needs it
    // so that we do not compute anything if not needed
    function getActions() {
        // Determine the events to bind. IE11 implements pointerEvents without
        // a prefix, which breaks compatibility with the IE10 implementation.
        return window.navigator.pointerEnabled ? {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
        } : window.navigator.msPointerEnabled ? {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        } : {
            start: "mousedown touchstart",
            move: "mousemove touchmove",
            end: "mouseup touchend"
        };
    }

    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // Issue #785
    function getSupportsPassive() {
        var supportsPassive = false;

        /* eslint-disable */
        try {
            var opts = Object.defineProperty({}, "passive", {
                get: function get() {
                    supportsPassive = true;
                }
            });

            window.addEventListener("test", null, opts);
        } catch (e) {}
        /* eslint-enable */

        return supportsPassive;
    }

    function getSupportsTouchActionNone() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }

    //endregion

    //region Range Calculation

    // Determine the size of a sub-range in relation to a full range.
    function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
    }

    // (percentage) How many percent is this value of this range?
    function fromPercentage(range, value) {
        return value * 100 / (range[1] - range[0]);
    }

    // (percentage) Where is this value on this range?
    function toPercentage(range, value) {
        return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0]);
    }

    // (value) How much is this percentage on this range?
    function isPercentage(range, value) {
        return value * (range[1] - range[0]) / 100 + range[0];
    }

    function getJ(value, arr) {
        var j = 1;

        while (value >= arr[j]) {
            j += 1;
        }

        return j;
    }

    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
    function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) {
            return 100;
        }

        var j = getJ(value, xVal);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
    }

    // (value) Input a percentage, find where it is on the specified range.
    function fromStepping(xVal, xPct, value) {
        // There is no range group that fits 100
        if (value >= 100) {
            return xVal.slice(-1)[0];
        }

        var j = getJ(value, xPct);
        var va = xVal[j - 1];
        var vb = xVal[j];
        var pa = xPct[j - 1];
        var pb = xPct[j];

        return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
    }

    // (percentage) Get the step that applies at a certain value.
    function getStep(xPct, xSteps, snap, value) {
        if (value === 100) {
            return value;
        }

        var j = getJ(value, xPct);
        var a = xPct[j - 1];
        var b = xPct[j];

        // If 'snap' is set, steps are used as fixed points on the slider.
        if (snap) {
            // Find the closest position, a or b.
            if (value - a > (b - a) / 2) {
                return b;
            }

            return a;
        }

        if (!xSteps[j - 1]) {
            return value;
        }

        return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
    }

    function handleEntryPoint(index, value, that) {
        var percentage;

        // Wrap numerical input in an array.
        if (typeof value === "number") {
            value = [value];
        }

        // Reject any invalid input, by testing whether value is an array.
        if (!Array.isArray(value)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
        }

        // Covert min/max syntax to 0 and 100.
        if (index === "min") {
            percentage = 0;
        } else if (index === "max") {
            percentage = 100;
        } else {
            percentage = parseFloat(index);
        }

        // Check for correct input.
        if (!isNumeric(percentage) || !isNumeric(value[0])) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
        }

        // Store values.
        that.xPct.push(percentage);
        that.xVal.push(value[0]);

        // NaN will evaluate to false too, but to keep
        // logging clear, set step explicitly. Make sure
        // not to override the 'step' setting with false.
        if (!percentage) {
            if (!isNaN(value[1])) {
                that.xSteps[0] = value[1];
            }
        } else {
            that.xSteps.push(isNaN(value[1]) ? false : value[1]);
        }

        that.xHighestCompleteStep.push(0);
    }

    function handleStepPoint(i, n, that) {
        // Ignore 'false' stepping.
        if (!n) {
            return;
        }

        // Step over zero-length ranges (#948);
        if (that.xVal[i] === that.xVal[i + 1]) {
            that.xSteps[i] = that.xHighestCompleteStep[i] = that.xVal[i];

            return;
        }

        // Factor to range ratio
        that.xSteps[i] = fromPercentage([that.xVal[i], that.xVal[i + 1]], n) / subRangeRatio(that.xPct[i], that.xPct[i + 1]);

        var totalSteps = (that.xVal[i + 1] - that.xVal[i]) / that.xNumSteps[i];
        var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
        var step = that.xVal[i] + that.xNumSteps[i] * highestStep;

        that.xHighestCompleteStep[i] = step;
    }

    //endregion

    //region Spectrum

    function Spectrum(entry, snap, singleStep) {
        this.xPct = [];
        this.xVal = [];
        this.xSteps = [singleStep || false];
        this.xNumSteps = [false];
        this.xHighestCompleteStep = [];

        this.snap = snap;

        var index;
        var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']

        // Map the object keys to an array.
        for (index in entry) {
            if (entry.hasOwnProperty(index)) {
                ordered.push([entry[index], index]);
            }
        }

        // Sort all entries by value (numeric sort).
        if (ordered.length && _typeof(ordered[0][0]) === "object") {
            ordered.sort(function (a, b) {
                return a[0][0] - b[0][0];
            });
        } else {
            ordered.sort(function (a, b) {
                return a[0] - b[0];
            });
        }

        // Convert all entries to subranges.
        for (index = 0; index < ordered.length; index++) {
            handleEntryPoint(ordered[index][1], ordered[index][0], this);
        }

        // Store the actual step values.
        // xSteps is sorted in the same order as xPct and xVal.
        this.xNumSteps = this.xSteps.slice(0);

        // Convert all numeric steps to the percentage of the subrange they represent.
        for (index = 0; index < this.xNumSteps.length; index++) {
            handleStepPoint(index, this.xNumSteps[index], this);
        }
    }

    Spectrum.prototype.getMargin = function (value) {
        var step = this.xNumSteps[0];

        if (step && value / step % 1 !== 0) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
        }

        return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
    };

    Spectrum.prototype.toStepping = function (value) {
        value = toStepping(this.xVal, this.xPct, value);

        return value;
    };

    Spectrum.prototype.fromStepping = function (value) {
        return fromStepping(this.xVal, this.xPct, value);
    };

    Spectrum.prototype.getStep = function (value) {
        value = getStep(this.xPct, this.xSteps, this.snap, value);

        return value;
    };

    Spectrum.prototype.getDefaultStep = function (value, isDown, size) {
        var j = getJ(value, this.xPct);

        // When at the top or stepping down, look at the previous sub-range
        if (value === 100 || isDown && value === this.xPct[j - 1]) {
            j = Math.max(j - 1, 1);
        }

        return (this.xVal[j] - this.xVal[j - 1]) / size;
    };

    Spectrum.prototype.getNearbySteps = function (value) {
        var j = getJ(value, this.xPct);

        return {
            stepBefore: {
                startValue: this.xVal[j - 2],
                step: this.xNumSteps[j - 2],
                highestStep: this.xHighestCompleteStep[j - 2]
            },
            thisStep: {
                startValue: this.xVal[j - 1],
                step: this.xNumSteps[j - 1],
                highestStep: this.xHighestCompleteStep[j - 1]
            },
            stepAfter: {
                startValue: this.xVal[j],
                step: this.xNumSteps[j],
                highestStep: this.xHighestCompleteStep[j]
            }
        };
    };

    Spectrum.prototype.countStepDecimals = function () {
        var stepDecimals = this.xNumSteps.map(countDecimals);
        return Math.max.apply(null, stepDecimals);
    };

    // Outside testing
    Spectrum.prototype.convert = function (value) {
        return this.getStep(this.toStepping(value));
    };

    //endregion

    //region Options

    /*	Every input option is tested and parsed. This'll prevent
        endless validation in internal methods. These tests are
        structured with an item for every option available. An
        option can be marked as required by setting the 'r' flag.
        The testing function is provided with three arguments:
            - The provided value for the option;
            - A reference to the options object;
            - The name for the option;
          The testing function returns false when an error is detected,
        or true when everything is OK. It can also modify the option
        object, to make sure all values can be correctly looped elsewhere. */

    var defaultFormatter = {
        to: function to(value) {
            return value !== undefined && value.toFixed(2);
        },
        from: Number
    };

    function validateFormat(entry) {
        // Any object with a to and from method is supported.
        if (isValidFormatter(entry)) {
            return true;
        }

        throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
    }

    function testStep(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
        }

        // The step option can still be used to set stepping
        // for linear sliders. Overwritten if set in 'range'.
        parsed.singleStep = entry;
    }

    function testRange(parsed, entry) {
        // Filter incorrect input.
        if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) !== "object" || Array.isArray(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
        }

        // Catch missing start or end.
        if (entry.min === undefined || entry.max === undefined) {
            throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
        }

        // Catch equal start or end.
        if (entry.min === entry.max) {
            throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
        }

        parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
    }

    function testStart(parsed, entry) {
        entry = asArray(entry);

        // Validate input. Values aren't tested, as the public .val method
        // will always provide a valid location.
        if (!Array.isArray(entry) || !entry.length) {
            throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
        }

        // Store the number of handles.
        parsed.handles = entry.length;

        // When the slider is initialized, the .val method will
        // be called with the start options.
        parsed.start = entry;
    }

    function testSnap(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.snap = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
        }
    }

    function testAnimate(parsed, entry) {
        // Enforce 100% stepping within subranges.
        parsed.animate = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
        }
    }

    function testAnimationDuration(parsed, entry) {
        parsed.animationDuration = entry;

        if (typeof entry !== "number") {
            throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
        }
    }

    function testConnect(parsed, entry) {
        var connect = [false];
        var i;

        // Map legacy options
        if (entry === "lower") {
            entry = [true, false];
        } else if (entry === "upper") {
            entry = [false, true];
        }

        // Handle boolean options
        if (entry === true || entry === false) {
            for (i = 1; i < parsed.handles; i++) {
                connect.push(entry);
            }

            connect.push(false);
        }

        // Reject invalid input
        else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
                throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
            } else {
                connect = entry;
            }

        parsed.connect = connect;
    }

    function testOrientation(parsed, entry) {
        // Set orientation to an a numerical value for easy
        // array selection.
        switch (entry) {
            case "horizontal":
                parsed.ort = 0;
                break;
            case "vertical":
                parsed.ort = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
        }
    }

    function testMargin(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
        }

        // Issue #582
        if (entry === 0) {
            return;
        }

        parsed.margin = parsed.spectrum.getMargin(entry);

        if (!parsed.margin) {
            throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
        }
    }

    function testLimit(parsed, entry) {
        if (!isNumeric(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
        }

        parsed.limit = parsed.spectrum.getMargin(entry);

        if (!parsed.limit || parsed.handles < 2) {
            throw new Error("noUiSlider (" + VERSION + "): 'limit' option is only supported on linear sliders with 2 or more handles.");
        }
    }

    function testPadding(parsed, entry) {
        if (!isNumeric(entry) && !Array.isArray(entry)) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers.");
        }

        if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers.");
        }

        if (entry === 0) {
            return;
        }

        if (!Array.isArray(entry)) {
            entry = [entry, entry];
        }

        // 'getMargin' returns false for invalid values.
        parsed.padding = [parsed.spectrum.getMargin(entry[0]), parsed.spectrum.getMargin(entry[1])];

        if (parsed.padding[0] === false || parsed.padding[1] === false) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
        }

        if (parsed.padding[0] < 0 || parsed.padding[1] < 0) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
        }

        if (parsed.padding[0] + parsed.padding[1] >= 100) {
            throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
        }
    }

    function testDirection(parsed, entry) {
        // Set direction as a numerical value for easy parsing.
        // Invert connection for RTL sliders, so that the proper
        // handles get the connect/background classes.
        switch (entry) {
            case "ltr":
                parsed.dir = 0;
                break;
            case "rtl":
                parsed.dir = 1;
                break;
            default:
                throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
        }
    }

    function testBehaviour(parsed, entry) {
        // Make sure the input is a string.
        if (typeof entry !== "string") {
            throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
        }

        // Check if the string contains any keywords.
        // None are required.
        var tap = entry.indexOf("tap") >= 0;
        var drag = entry.indexOf("drag") >= 0;
        var fixed = entry.indexOf("fixed") >= 0;
        var snap = entry.indexOf("snap") >= 0;
        var hover = entry.indexOf("hover") >= 0;
        var unconstrained = entry.indexOf("unconstrained") >= 0;

        if (fixed) {
            if (parsed.handles !== 2) {
                throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
            }

            // Use margin to enforce fixed state
            testMargin(parsed, parsed.start[1] - parsed.start[0]);
        }

        if (unconstrained && (parsed.margin || parsed.limit)) {
            throw new Error("noUiSlider (" + VERSION + "): 'unconstrained' behaviour cannot be used with margin or limit");
        }

        parsed.events = {
            tap: tap || snap,
            drag: drag,
            fixed: fixed,
            snap: snap,
            hover: hover,
            unconstrained: unconstrained
        };
    }

    function testTooltips(parsed, entry) {
        if (entry === false) {
            return;
        }

        if (entry === true) {
            parsed.tooltips = [];

            for (var i = 0; i < parsed.handles; i++) {
                parsed.tooltips.push(true);
            }
        } else {
            parsed.tooltips = asArray(entry);

            if (parsed.tooltips.length !== parsed.handles) {
                throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
            }

            parsed.tooltips.forEach(function (formatter) {
                if (typeof formatter !== "boolean" && ((typeof formatter === "undefined" ? "undefined" : _typeof(formatter)) !== "object" || typeof formatter.to !== "function")) {
                    throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
                }
            });
        }
    }

    function testAriaFormat(parsed, entry) {
        parsed.ariaFormat = entry;
        validateFormat(entry);
    }

    function testFormat(parsed, entry) {
        parsed.format = entry;
        validateFormat(entry);
    }

    function testKeyboardSupport(parsed, entry) {
        parsed.keyboardSupport = entry;

        if (typeof entry !== "boolean") {
            throw new Error("noUiSlider (" + VERSION + "): 'keyboardSupport' option must be a boolean.");
        }
    }

    function testDocumentElement(parsed, entry) {
        // This is an advanced option. Passed values are used without validation.
        parsed.documentElement = entry;
    }

    function testCssPrefix(parsed, entry) {
        if (typeof entry !== "string" && entry !== false) {
            throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
        }

        parsed.cssPrefix = entry;
    }

    function testCssClasses(parsed, entry) {
        if ((typeof entry === "undefined" ? "undefined" : _typeof(entry)) !== "object") {
            throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
        }

        if (typeof parsed.cssPrefix === "string") {
            parsed.cssClasses = {};

            for (var key in entry) {
                if (!entry.hasOwnProperty(key)) {
                    continue;
                }

                parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
            }
        } else {
            parsed.cssClasses = entry;
        }
    }

    // Test all developer settings and parse to assumption-safe values.
    function testOptions(options) {
        // To prove a fix for #537, freeze options here.
        // If the object is modified, an error will be thrown.
        // Object.freeze(options);

        var parsed = {
            margin: 0,
            limit: 0,
            padding: 0,
            animate: true,
            animationDuration: 300,
            ariaFormat: defaultFormatter,
            format: defaultFormatter
        };

        // Tests are executed in the order they are presented here.
        var tests = {
            step: { r: false, t: testStep },
            start: { r: true, t: testStart },
            connect: { r: true, t: testConnect },
            direction: { r: true, t: testDirection },
            snap: { r: false, t: testSnap },
            animate: { r: false, t: testAnimate },
            animationDuration: { r: false, t: testAnimationDuration },
            range: { r: true, t: testRange },
            orientation: { r: false, t: testOrientation },
            margin: { r: false, t: testMargin },
            limit: { r: false, t: testLimit },
            padding: { r: false, t: testPadding },
            behaviour: { r: true, t: testBehaviour },
            ariaFormat: { r: false, t: testAriaFormat },
            format: { r: false, t: testFormat },
            tooltips: { r: false, t: testTooltips },
            keyboardSupport: { r: true, t: testKeyboardSupport },
            documentElement: { r: false, t: testDocumentElement },
            cssPrefix: { r: true, t: testCssPrefix },
            cssClasses: { r: true, t: testCssClasses }
        };

        var defaults = {
            connect: false,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: true,
            cssPrefix: "noUi-",
            cssClasses: {
                target: "target",
                base: "base",
                origin: "origin",
                handle: "handle",
                handleLower: "handle-lower",
                handleUpper: "handle-upper",
                touchArea: "touch-area",
                horizontal: "horizontal",
                vertical: "vertical",
                background: "background",
                connect: "connect",
                connects: "connects",
                ltr: "ltr",
                rtl: "rtl",
                draggable: "draggable",
                drag: "state-drag",
                tap: "state-tap",
                active: "active",
                tooltip: "tooltip",
                pips: "pips",
                pipsHorizontal: "pips-horizontal",
                pipsVertical: "pips-vertical",
                marker: "marker",
                markerHorizontal: "marker-horizontal",
                markerVertical: "marker-vertical",
                markerNormal: "marker-normal",
                markerLarge: "marker-large",
                markerSub: "marker-sub",
                value: "value",
                valueHorizontal: "value-horizontal",
                valueVertical: "value-vertical",
                valueNormal: "value-normal",
                valueLarge: "value-large",
                valueSub: "value-sub"
            }
        };

        // AriaFormat defaults to regular format, if any.
        if (options.format && !options.ariaFormat) {
            options.ariaFormat = options.format;
        }

        // Run all options through a testing mechanism to ensure correct
        // input. It should be noted that options might get modified to
        // be handled properly. E.g. wrapping integers in arrays.
        Object.keys(tests).forEach(function (name) {
            // If the option isn't set, but it is required, throw an error.
            if (!isSet(options[name]) && defaults[name] === undefined) {
                if (tests[name].r) {
                    throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
                }

                return true;
            }

            tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
        });

        // Forward pips options
        parsed.pips = options.pips;

        // All recent browsers accept unprefixed transform.
        // We need -ms- for IE9 and -webkit- for older Android;
        // Assume use of -webkit- if unprefixed and -ms- are not supported.
        // https://caniuse.com/#feat=transforms2d
        var d = document.createElement("div");
        var msPrefix = d.style.msTransform !== undefined;
        var noPrefix = d.style.transform !== undefined;

        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";

        // Pips don't move, so we can place them using left/top.
        var styles = [["left", "top"], ["right", "bottom"]];

        parsed.style = styles[parsed.dir][parsed.ort];

        return parsed;
    }

    //endregion

    function scope(target, options, originalOptions) {
        var actions = getActions();
        var supportsTouchActionNone = getSupportsTouchActionNone();
        var supportsPassive = supportsTouchActionNone && getSupportsPassive();

        // All variables local to 'scope' are prefixed with 'scope_'

        // Slider DOM Nodes
        var scope_Target = target;
        var scope_Base;
        var scope_Handles;
        var scope_Connects;
        var scope_Pips;
        var scope_Tooltips;

        // Slider state values
        var scope_Spectrum = options.spectrum;
        var scope_Values = [];
        var scope_Locations = [];
        var scope_HandleNumbers = [];
        var scope_ActiveHandlesCount = 0;
        var scope_Events = {};

        // Exposed API
        var scope_Self;

        // Document Nodes
        var scope_Document = target.ownerDocument;
        var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
        var scope_Body = scope_Document.body;

        // Pips constants
        var PIPS_NONE = -1;
        var PIPS_NO_VALUE = 0;
        var PIPS_LARGE_VALUE = 1;
        var PIPS_SMALL_VALUE = 2;

        // For horizontal sliders in standard ltr documents,
        // make .noUi-origin overflow to the left so the document doesn't scroll.
        var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;

        // Creates a node, adds it to target, returns the new node.
        function addNodeTo(addTarget, className) {
            var div = scope_Document.createElement("div");

            if (className) {
                addClass(div, className);
            }

            addTarget.appendChild(div);

            return div;
        }

        // Append a origin to the base
        function addOrigin(base, handleNumber) {
            var origin = addNodeTo(base, options.cssClasses.origin);
            var handle = addNodeTo(origin, options.cssClasses.handle);

            addNodeTo(handle, options.cssClasses.touchArea);

            handle.setAttribute("data-handle", handleNumber);

            if (options.keyboardSupport) {
                // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
                // 0 = focusable and reachable
                handle.setAttribute("tabindex", "0");
                handle.addEventListener("keydown", function (event) {
                    return eventKeydown(event, handleNumber);
                });
            }

            handle.setAttribute("role", "slider");
            handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");

            if (handleNumber === 0) {
                addClass(handle, options.cssClasses.handleLower);
            } else if (handleNumber === options.handles - 1) {
                addClass(handle, options.cssClasses.handleUpper);
            }

            return origin;
        }

        // Insert nodes for connect elements
        function addConnect(base, add) {
            if (!add) {
                return false;
            }

            return addNodeTo(base, options.cssClasses.connect);
        }

        // Add handles to the slider base.
        function addElements(connectOptions, base) {
            var connectBase = addNodeTo(base, options.cssClasses.connects);

            scope_Handles = [];
            scope_Connects = [];

            scope_Connects.push(addConnect(connectBase, connectOptions[0]));

            // [::::O====O====O====]
            // connectOptions = [0, 1, 1, 1]

            for (var i = 0; i < options.handles; i++) {
                // Keep a list of all added handles.
                scope_Handles.push(addOrigin(base, i));
                scope_HandleNumbers[i] = i;
                scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
            }
        }

        // Initialize a single slider.
        function addSlider(addTarget) {
            // Apply classes and data to the target.
            addClass(addTarget, options.cssClasses.target);

            if (options.dir === 0) {
                addClass(addTarget, options.cssClasses.ltr);
            } else {
                addClass(addTarget, options.cssClasses.rtl);
            }

            if (options.ort === 0) {
                addClass(addTarget, options.cssClasses.horizontal);
            } else {
                addClass(addTarget, options.cssClasses.vertical);
            }

            return addNodeTo(addTarget, options.cssClasses.base);
        }

        function addTooltip(handle, handleNumber) {
            if (!options.tooltips[handleNumber]) {
                return false;
            }

            return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
        }

        function isSliderDisabled() {
            return scope_Target.hasAttribute("disabled");
        }

        // Disable the slider dragging if any handle is disabled
        function isHandleDisabled(handleNumber) {
            var handleOrigin = scope_Handles[handleNumber];
            return handleOrigin.hasAttribute("disabled");
        }

        function removeTooltips() {
            if (scope_Tooltips) {
                removeEvent("update.tooltips");
                scope_Tooltips.forEach(function (tooltip) {
                    if (tooltip) {
                        removeElement(tooltip);
                    }
                });
                scope_Tooltips = null;
            }
        }

        // The tooltips option is a shorthand for using the 'update' event.
        function tooltips() {
            removeTooltips();

            // Tooltips are added with options.tooltips in original order.
            scope_Tooltips = scope_Handles.map(addTooltip);

            bindEvent("update.tooltips", function (values, handleNumber, unencoded) {
                if (!scope_Tooltips[handleNumber]) {
                    return;
                }

                var formattedValue = values[handleNumber];

                if (options.tooltips[handleNumber] !== true) {
                    formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
                }

                scope_Tooltips[handleNumber].innerHTML = formattedValue;
            });
        }

        function aria() {
            bindEvent("update", function (values, handleNumber, unencoded, tap, positions) {
                // Update Aria Values for all handles, as a change in one changes min and max values for the next.
                scope_HandleNumbers.forEach(function (index) {
                    var handle = scope_Handles[index];

                    var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                    var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);

                    var now = positions[index];

                    // Formatted value for display
                    var text = options.ariaFormat.to(unencoded[index]);

                    // Map to slider range values
                    min = scope_Spectrum.fromStepping(min).toFixed(1);
                    max = scope_Spectrum.fromStepping(max).toFixed(1);
                    now = scope_Spectrum.fromStepping(now).toFixed(1);

                    handle.children[0].setAttribute("aria-valuemin", min);
                    handle.children[0].setAttribute("aria-valuemax", max);
                    handle.children[0].setAttribute("aria-valuenow", now);
                    handle.children[0].setAttribute("aria-valuetext", text);
                });
            });
        }

        function getGroup(mode, values, stepped) {
            // Use the range.
            if (mode === "range" || mode === "steps") {
                return scope_Spectrum.xVal;
            }

            if (mode === "count") {
                if (values < 2) {
                    throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
                }

                // Divide 0 - 100 in 'count' parts.
                var interval = values - 1;
                var spread = 100 / interval;

                values = [];

                // List these parts and have them handled as 'positions'.
                while (interval--) {
                    values[interval] = interval * spread;
                }

                values.push(100);

                mode = "positions";
            }

            if (mode === "positions") {
                // Map all percentages to on-range values.
                return values.map(function (value) {
                    return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
                });
            }

            if (mode === "values") {
                // If the value must be stepped, it needs to be converted to a percentage first.
                if (stepped) {
                    return values.map(function (value) {
                        // Convert to percentage, apply step, return to value.
                        return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                    });
                }

                // Otherwise, we can simply use the values.
                return values;
            }
        }

        function generateSpread(density, mode, group) {
            function safeIncrement(value, increment) {
                // Avoid floating point variance by dropping the smallest decimal places.
                return (value + increment).toFixed(7) / 1;
            }

            var indexes = {};
            var firstInRange = scope_Spectrum.xVal[0];
            var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
            var ignoreFirst = false;
            var ignoreLast = false;
            var prevPct = 0;

            // Create a copy of the group, sort it and filter away all duplicates.
            group = unique(group.slice().sort(function (a, b) {
                return a - b;
            }));

            // Make sure the range starts with the first element.
            if (group[0] !== firstInRange) {
                group.unshift(firstInRange);
                ignoreFirst = true;
            }

            // Likewise for the last one.
            if (group[group.length - 1] !== lastInRange) {
                group.push(lastInRange);
                ignoreLast = true;
            }

            group.forEach(function (current, index) {
                // Get the current step and the lower + upper positions.
                var step;
                var i;
                var q;
                var low = current;
                var high = group[index + 1];
                var newPct;
                var pctDifference;
                var pctPos;
                var type;
                var steps;
                var realSteps;
                var stepSize;
                var isSteps = mode === "steps";

                // When using 'steps' mode, use the provided steps.
                // Otherwise, we'll step on to the next subrange.
                if (isSteps) {
                    step = scope_Spectrum.xNumSteps[index];
                }

                // Default to a 'full' step.
                if (!step) {
                    step = high - low;
                }

                // Low can be 0, so test for false. If high is undefined,
                // we are at the last subrange. Index 0 is already handled.
                if (low === false || high === undefined) {
                    return;
                }

                // Make sure step isn't 0, which would cause an infinite loop (#654)
                step = Math.max(step, 0.0000001);

                // Find all steps in the subrange.
                for (i = low; i <= high; i = safeIncrement(i, step)) {
                    // Get the percentage value for the current step,
                    // calculate the size for the subrange.
                    newPct = scope_Spectrum.toStepping(i);
                    pctDifference = newPct - prevPct;

                    steps = pctDifference / density;
                    realSteps = Math.round(steps);

                    // This ratio represents the amount of percentage-space a point indicates.
                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                    // Round the percentage offset to an even number, then divide by two
                    // to spread the offset on both sides of the range.
                    stepSize = pctDifference / realSteps;

                    // Divide all points evenly, adding the correct number to this subrange.
                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                    for (q = 1; q <= realSteps; q += 1) {
                        // The ratio between the rounded value and the actual size might be ~1% off.
                        // Correct the percentage offset by the number of points
                        // per subrange. density = 1 will result in 100 points on the
                        // full range, 2 for 50, 4 for 25, etc.
                        pctPos = prevPct + q * stepSize;
                        indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
                    }

                    // Determine the point type.
                    type = group.indexOf(i) > -1 ? PIPS_LARGE_VALUE : isSteps ? PIPS_SMALL_VALUE : PIPS_NO_VALUE;

                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                    if (!index && ignoreFirst) {
                        type = 0;
                    }

                    if (!(i === high && ignoreLast)) {
                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                        indexes[newPct.toFixed(5)] = [i, type];
                    }

                    // Update the percentage count.
                    prevPct = newPct;
                }
            });

            return indexes;
        }

        function addMarking(spread, filterFunc, formatter) {
            var element = scope_Document.createElement("div");

            var valueSizeClasses = [];
            valueSizeClasses[PIPS_NO_VALUE] = options.cssClasses.valueNormal;
            valueSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.valueLarge;
            valueSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.valueSub;

            var markerSizeClasses = [];
            markerSizeClasses[PIPS_NO_VALUE] = options.cssClasses.markerNormal;
            markerSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.markerLarge;
            markerSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.markerSub;

            var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
            var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];

            addClass(element, options.cssClasses.pips);
            addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

            function getClasses(type, source) {
                var a = source === options.cssClasses.value;
                var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
                var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

                return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
            }

            function addSpread(offset, value, type) {
                // Apply the filter function, if it is set.
                type = filterFunc ? filterFunc(value, type) : type;

                if (type === PIPS_NONE) {
                    return;
                }

                // Add a marker for every point
                var node = addNodeTo(element, false);
                node.className = getClasses(type, options.cssClasses.marker);
                node.style[options.style] = offset + "%";

                // Values are only appended for points marked '1' or '2'.
                if (type > PIPS_NO_VALUE) {
                    node = addNodeTo(element, false);
                    node.className = getClasses(type, options.cssClasses.value);
                    node.setAttribute("data-value", value);
                    node.style[options.style] = offset + "%";
                    node.innerHTML = formatter.to(value);
                }
            }

            // Append all points.
            Object.keys(spread).forEach(function (offset) {
                addSpread(offset, spread[offset][0], spread[offset][1]);
            });

            return element;
        }

        function removePips() {
            if (scope_Pips) {
                removeElement(scope_Pips);
                scope_Pips = null;
            }
        }

        function pips(grid) {
            // Fix #669
            removePips();

            var mode = grid.mode;
            var density = grid.density || 1;
            var filter = grid.filter || false;
            var values = grid.values || false;
            var stepped = grid.stepped || false;
            var group = getGroup(mode, values, stepped);
            var spread = generateSpread(density, mode, group);
            var format = grid.format || {
                to: Math.round
            };

            scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));

            return scope_Pips;
        }

        // Shorthand for base dimensions.
        function baseSize() {
            var rect = scope_Base.getBoundingClientRect();
            var alt = "offset" + ["Width", "Height"][options.ort];
            return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
        }

        // Handler for attaching events trough a proxy.
        function attachEvent(events, element, callback, data) {
            // This function can be used to 'filter' events to the slider.
            // element is a node, not a nodeList

            var method = function method(e) {
                e = fixEvent(e, data.pageOffset, data.target || element);

                // fixEvent returns false if this event has a different target
                // when handling (multi-) touch events;
                if (!e) {
                    return false;
                }

                // doNotReject is passed by all end events to make sure released touches
                // are not rejected, leaving the slider "stuck" to the cursor;
                if (isSliderDisabled() && !data.doNotReject) {
                    return false;
                }

                // Stop if an active 'tap' transition is taking place.
                if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                    return false;
                }

                // Ignore right or middle clicks on start #454
                if (data.hover && e.buttons) {
                    return false;
                }

                // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
                // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
                // touch-action: manipulation, but that allows panning, which breaks
                // sliders after zooming/on non-responsive pages.
                // See: https://bugs.webkit.org/show_bug.cgi?id=133112
                if (!supportsPassive) {
                    e.preventDefault();
                }

                e.calcPoint = e.points[options.ort];

                // Call the event handler with the event [ and additional data ].
                callback(e, data);
            };

            var methods = [];

            // Bind a closure on the target for every event type.
            events.split(" ").forEach(function (eventName) {
                element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
                methods.push([eventName, method]);
            });

            return methods;
        }

        // Provide a clean event with standardized offset values.
        function fixEvent(e, pageOffset, eventTarget) {
            // Filter the event to register the type, which can be
            // touch, mouse or pointer. Offset changes need to be
            // made on an event specific basis.
            var touch = e.type.indexOf("touch") === 0;
            var mouse = e.type.indexOf("mouse") === 0;
            var pointer = e.type.indexOf("pointer") === 0;

            var x;
            var y;

            // IE10 implemented pointer events with a prefix;
            if (e.type.indexOf("MSPointer") === 0) {
                pointer = true;
            }

            // The only thing one handle should be concerned about is the touches that originated on top of it.
            if (touch) {
                // Returns true if a touch originated on the target.
                var isTouchOnTarget = function isTouchOnTarget(checkTouch) {
                    return checkTouch.target === eventTarget || eventTarget.contains(checkTouch.target);
                };

                // In the case of touchstart events, we need to make sure there is still no more than one
                // touch on the target so we look amongst all touches.
                if (e.type === "touchstart") {
                    var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);

                    // Do not support more than one touch per handle.
                    if (targetTouches.length > 1) {
                        return false;
                    }

                    x = targetTouches[0].pageX;
                    y = targetTouches[0].pageY;
                } else {
                    // In the other cases, find on changedTouches is enough.
                    var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);

                    // Cancel if the target touch has not moved.
                    if (!targetTouch) {
                        return false;
                    }

                    x = targetTouch.pageX;
                    y = targetTouch.pageY;
                }
            }

            pageOffset = pageOffset || getPageOffset(scope_Document);

            if (mouse || pointer) {
                x = e.clientX + pageOffset.x;
                y = e.clientY + pageOffset.y;
            }

            e.pageOffset = pageOffset;
            e.points = [x, y];
            e.cursor = mouse || pointer; // Fix #435

            return e;
        }

        // Translate a coordinate in the document to a percentage on the slider
        function calcPointToPercentage(calcPoint) {
            var location = calcPoint - offset(scope_Base, options.ort);
            var proposal = location * 100 / baseSize();

            // Clamp proposal between 0% and 100%
            // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
            // are used (e.g. contained handles feature)
            proposal = limit(proposal);

            return options.dir ? 100 - proposal : proposal;
        }

        // Find handle closest to a certain percentage on the slider
        function getClosestHandle(proposal) {
            var closest = 100;
            var handleNumber = false;

            scope_Handles.forEach(function (handle, index) {
                // Disabled handles are ignored
                if (isHandleDisabled(index)) {
                    return;
                }

                var pos = Math.abs(scope_Locations[index] - proposal);

                if (pos < closest || pos === 100 && closest === 100) {
                    handleNumber = index;
                    closest = pos;
                }
            });

            return handleNumber;
        }

        // Fire 'end' when a mouse or pen leaves the document.
        function documentLeave(event, data) {
            if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
                eventEnd(event, data);
            }
        }

        // Handle movement on document for handle and range drag.
        function eventMove(event, data) {
            // Fix #498
            // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
            // IE9 has .buttons and .which zero on mousemove.
            // Firefox breaks the spec MDN defines.
            if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
                return eventEnd(event, data);
            }

            // Check if we are moving up or down
            var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

            // Convert the movement into a percentage of the slider width/height
            var proposal = movement * 100 / data.baseSize;

            moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
        }

        // Unbind move events on document, call callbacks.
        function eventEnd(event, data) {
            // The handle is no longer active, so remove the class.
            if (data.handle) {
                removeClass(data.handle, options.cssClasses.active);
                scope_ActiveHandlesCount -= 1;
            }

            // Unbind the move and end events, which are added on 'start'.
            data.listeners.forEach(function (c) {
                scope_DocumentElement.removeEventListener(c[0], c[1]);
            });

            if (scope_ActiveHandlesCount === 0) {
                // Remove dragging class.
                removeClass(scope_Target, options.cssClasses.drag);
                setZindex();

                // Remove cursor styles and text-selection events bound to the body.
                if (event.cursor) {
                    scope_Body.style.cursor = "";
                    scope_Body.removeEventListener("selectstart", preventDefault);
                }
            }

            data.handleNumbers.forEach(function (handleNumber) {
                fireEvent("change", handleNumber);
                fireEvent("set", handleNumber);
                fireEvent("end", handleNumber);
            });
        }

        // Bind move events on document.
        function eventStart(event, data) {
            // Ignore event if any handle is disabled
            if (data.handleNumbers.some(isHandleDisabled)) {
                return false;
            }

            var handle;

            if (data.handleNumbers.length === 1) {
                var handleOrigin = scope_Handles[data.handleNumbers[0]];

                handle = handleOrigin.children[0];
                scope_ActiveHandlesCount += 1;

                // Mark the handle as 'active' so it can be styled.
                addClass(handle, options.cssClasses.active);
            }

            // A drag should never propagate up to the 'tap' event.
            event.stopPropagation();

            // Record the event listeners.
            var listeners = [];

            // Attach the move and end events.
            var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                // The event target has changed so we need to propagate the original one so that we keep
                // relying on it to extract target touches.
                target: event.target,
                handle: handle,
                listeners: listeners,
                startCalcPoint: event.calcPoint,
                baseSize: baseSize(),
                pageOffset: event.pageOffset,
                handleNumbers: data.handleNumbers,
                buttonsProperty: event.buttons,
                locations: scope_Locations.slice()
            });

            var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                target: event.target,
                handle: handle,
                listeners: listeners,
                doNotReject: true,
                handleNumbers: data.handleNumbers
            });

            // We want to make sure we pushed the listeners in the listener list rather than creating
            // a new one as it has already been passed to the event handlers.
            listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

            // Text selection isn't an issue on touch devices,
            // so adding cursor styles can be skipped.
            if (event.cursor) {
                // Prevent the 'I' cursor and extend the range-drag cursor.
                scope_Body.style.cursor = getComputedStyle(event.target).cursor;

                // Mark the target with a dragging state.
                if (scope_Handles.length > 1) {
                    addClass(scope_Target, options.cssClasses.drag);
                }

                // Prevent text selection when dragging the handles.
                // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
                // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
                // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
                // The 'cursor' flag is false.
                // See: http://caniuse.com/#search=selectstart
                scope_Body.addEventListener("selectstart", preventDefault, false);
            }

            data.handleNumbers.forEach(function (handleNumber) {
                fireEvent("start", handleNumber);
            });
        }

        // Move closest handle to tapped location.
        function eventTap(event) {
            // The tap event shouldn't propagate up
            event.stopPropagation();

            var proposal = calcPointToPercentage(event.calcPoint);
            var handleNumber = getClosestHandle(proposal);

            // Tackle the case that all handles are 'disabled'.
            if (handleNumber === false) {
                return false;
            }

            // Flag the slider as it is now in a transitional state.
            // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
            if (!options.events.snap) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            setHandle(handleNumber, proposal, true, true);

            setZindex();

            fireEvent("slide", handleNumber, true);
            fireEvent("update", handleNumber, true);
            fireEvent("change", handleNumber, true);
            fireEvent("set", handleNumber, true);

            if (options.events.snap) {
                eventStart(event, { handleNumbers: [handleNumber] });
            }
        }

        // Fires a 'hover' event for a hovered mouse/pen position.
        function eventHover(event) {
            var proposal = calcPointToPercentage(event.calcPoint);

            var to = scope_Spectrum.getStep(proposal);
            var value = scope_Spectrum.fromStepping(to);

            Object.keys(scope_Events).forEach(function (targetEvent) {
                if ("hover" === targetEvent.split(".")[0]) {
                    scope_Events[targetEvent].forEach(function (callback) {
                        callback.call(scope_Self, value);
                    });
                }
            });
        }

        // Handles keydown on focused handles
        // Don't move the document when pressing arrow keys on focused handles
        function eventKeydown(event, handleNumber) {
            if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
                return false;
            }

            var horizontalKeys = ["Left", "Right"];
            var verticalKeys = ["Down", "Up"];

            if (options.dir && !options.ort) {
                // On an right-to-left slider, the left and right keys act inverted
                horizontalKeys.reverse();
            } else if (options.ort && !options.dir) {
                // On a top-to-bottom slider, the up and down keys act inverted
                verticalKeys.reverse();
            }

            // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            var key = event.key.replace("Arrow", "");
            var isDown = key === verticalKeys[0] || key === horizontalKeys[0];
            var isUp = key === verticalKeys[1] || key === horizontalKeys[1];

            if (!isDown && !isUp) {
                return true;
            }

            event.preventDefault();

            var direction = isDown ? 0 : 1;
            var steps = getNextStepsForHandle(handleNumber);
            var step = steps[direction];

            // At the edge of a slider, do nothing
            if (step === null) {
                return false;
            }

            // No step set, use the default of 10% of the sub-range
            if (step === false) {
                step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, 10);
            }

            // Step over zero-length ranges (#948);
            step = Math.max(step, 0.0000001);

            // Decrement for down steps
            step = (isDown ? -1 : 1) * step;

            valueSetHandle(handleNumber, scope_Values[handleNumber] + step, true);

            return false;
        }

        // Attach events to several slider parts.
        function bindSliderEvents(behaviour) {
            // Attach the standard drag event to the handles.
            if (!behaviour.fixed) {
                scope_Handles.forEach(function (handle, index) {
                    // These events are only bound to the visual handle
                    // element, not the 'real' origin element.
                    attachEvent(actions.start, handle.children[0], eventStart, {
                        handleNumbers: [index]
                    });
                });
            }

            // Attach the tap event to the slider base.
            if (behaviour.tap) {
                attachEvent(actions.start, scope_Base, eventTap, {});
            }

            // Fire hover events
            if (behaviour.hover) {
                attachEvent(actions.move, scope_Base, eventHover, {
                    hover: true
                });
            }

            // Make the range draggable.
            if (behaviour.drag) {
                scope_Connects.forEach(function (connect, index) {
                    if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                        return;
                    }

                    var handleBefore = scope_Handles[index - 1];
                    var handleAfter = scope_Handles[index];
                    var eventHolders = [connect];

                    addClass(connect, options.cssClasses.draggable);

                    // When the range is fixed, the entire range can
                    // be dragged by the handles. The handle in the first
                    // origin will propagate the start event upward,
                    // but it needs to be bound manually on the other.
                    if (behaviour.fixed) {
                        eventHolders.push(handleBefore.children[0]);
                        eventHolders.push(handleAfter.children[0]);
                    }

                    eventHolders.forEach(function (eventHolder) {
                        attachEvent(actions.start, eventHolder, eventStart, {
                            handles: [handleBefore, handleAfter],
                            handleNumbers: [index - 1, index]
                        });
                    });
                });
            }
        }

        // Attach an event to this slider, possibly including a namespace
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
            scope_Events[namespacedEvent].push(callback);

            // If the event bound is 'update,' fire it immediately for all handles.
            if (namespacedEvent.split(".")[0] === "update") {
                scope_Handles.forEach(function (a, index) {
                    fireEvent("update", index);
                });
            }
        }

        // Undo attachment of event
        function removeEvent(namespacedEvent) {
            var event = namespacedEvent && namespacedEvent.split(".")[0];
            var namespace = event && namespacedEvent.substring(event.length);

            Object.keys(scope_Events).forEach(function (bind) {
                var tEvent = bind.split(".")[0];
                var tNamespace = bind.substring(tEvent.length);

                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                    delete scope_Events[bind];
                }
            });
        }

        // External event handling
        function fireEvent(eventName, handleNumber, tap) {
            Object.keys(scope_Events).forEach(function (targetEvent) {
                var eventType = targetEvent.split(".")[0];

                if (eventName === eventType) {
                    scope_Events[targetEvent].forEach(function (callback) {
                        callback.call(
                        // Use the slider public API as the scope ('this')
                        scope_Self,
                        // Return values as array, so arg_1[arg_2] is always valid.
                        scope_Values.map(options.format.to),
                        // Handle index, 0 or 1
                        handleNumber,
                        // Un-formatted slider values
                        scope_Values.slice(),
                        // Event is fired by tap, true or false
                        tap || false,
                        // Left offset of the handle, in relation to the slider
                        scope_Locations.slice());
                    });
                }
            });
        }

        // Split out the handle positioning logic so the Move event can use it, too
        function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
            // For sliders with multiple handles, limit movement to the other handle.
            // Apply the margin option by adding it to the handle positions.
            if (scope_Handles.length > 1 && !options.events.unconstrained) {
                if (lookBackward && handleNumber > 0) {
                    to = Math.max(to, reference[handleNumber - 1] + options.margin);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    to = Math.min(to, reference[handleNumber + 1] - options.margin);
                }
            }

            // The limit option has the opposite effect, limiting handles to a
            // maximum distance from another. Limit must be > 0, as otherwise
            // handles would be unmovable.
            if (scope_Handles.length > 1 && options.limit) {
                if (lookBackward && handleNumber > 0) {
                    to = Math.min(to, reference[handleNumber - 1] + options.limit);
                }

                if (lookForward && handleNumber < scope_Handles.length - 1) {
                    to = Math.max(to, reference[handleNumber + 1] - options.limit);
                }
            }

            // The padding option keeps the handles a certain distance from the
            // edges of the slider. Padding must be > 0.
            if (options.padding) {
                if (handleNumber === 0) {
                    to = Math.max(to, options.padding[0]);
                }

                if (handleNumber === scope_Handles.length - 1) {
                    to = Math.min(to, 100 - options.padding[1]);
                }
            }

            to = scope_Spectrum.getStep(to);

            // Limit percentage to the 0 - 100 range
            to = limit(to);

            // Return false if handle can't move
            if (to === reference[handleNumber] && !getValue) {
                return false;
            }

            return to;
        }

        // Uses slider orientation to create CSS rules. a = base value;
        function inRuleOrder(v, a) {
            var o = options.ort;
            return (o ? a : v) + ", " + (o ? v : a);
        }

        // Moves handle(s) by a percentage
        // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
        function moveHandles(upward, proposal, locations, handleNumbers) {
            var proposals = locations.slice();

            var b = [!upward, upward];
            var f = [upward, !upward];

            // Copy handleNumbers so we don't change the dataset
            handleNumbers = handleNumbers.slice();

            // Check to see which handle is 'leading'.
            // If that one can't move the second can't either.
            if (upward) {
                handleNumbers.reverse();
            }

            // Step 1: get the maximum percentage that any of the handles can move
            if (handleNumbers.length > 1) {
                handleNumbers.forEach(function (handleNumber, o) {
                    var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false);

                    // Stop if one of the handles can't move.
                    if (to === false) {
                        proposal = 0;
                    } else {
                        proposal = to - proposals[handleNumber];
                        proposals[handleNumber] = to;
                    }
                });
            }

            // If using one handle, check backward AND forward
            else {
                    b = f = [true];
                }

            var state = false;

            // Step 2: Try to set the handles with the found percentage
            handleNumbers.forEach(function (handleNumber, o) {
                state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
            });

            // Step 3: If a handle moved, fire events
            if (state) {
                handleNumbers.forEach(function (handleNumber) {
                    fireEvent("update", handleNumber);
                    fireEvent("slide", handleNumber);
                });
            }
        }

        // Takes a base value and an offset. This offset is used for the connect bar size.
        // In the initial design for this feature, the origin element was 1% wide.
        // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
        // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
        function transformDirection(a, b) {
            return options.dir ? 100 - a - b : a;
        }

        // Updates scope_Locations and scope_Values, updates visual state
        function updateHandlePosition(handleNumber, to) {
            // Update locations.
            scope_Locations[handleNumber] = to;

            // Convert the value to the slider stepping/range.
            scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

            var rule = "translate(" + inRuleOrder(transformDirection(to, 0) - scope_DirOffset + "%", "0") + ")";
            scope_Handles[handleNumber].style[options.transformRule] = rule;

            updateConnect(handleNumber);
            updateConnect(handleNumber + 1);
        }

        // Handles before the slider middle are stacked later = higher,
        // Handles after the middle later is lower
        // [[7] [8] .......... | .......... [5] [4]
        function setZindex() {
            scope_HandleNumbers.forEach(function (handleNumber) {
                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
                var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                scope_Handles[handleNumber].style.zIndex = zIndex;
            });
        }

        // Test suggested values and apply margin, step.
        function setHandle(handleNumber, to, lookBackward, lookForward) {
            to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);

            if (to === false) {
                return false;
            }

            updateHandlePosition(handleNumber, to);

            return true;
        }

        // Updates style attribute for connect nodes
        function updateConnect(index) {
            // Skip connects set to false
            if (!scope_Connects[index]) {
                return;
            }

            var l = 0;
            var h = 100;

            if (index !== 0) {
                l = scope_Locations[index - 1];
            }

            if (index !== scope_Connects.length - 1) {
                h = scope_Locations[index];
            }

            // We use two rules:
            // 'translate' to change the left/top offset;
            // 'scale' to change the width of the element;
            // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
            var connectWidth = h - l;
            var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
            var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";

            scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
        }

        // Parses value passed to .set method. Returns current value if not parse-able.
        function resolveToValue(to, handleNumber) {
            // Setting with null indicates an 'ignore'.
            // Inputting 'false' is invalid.
            if (to === null || to === false || to === undefined) {
                return scope_Locations[handleNumber];
            }

            // If a formatted number was passed, attempt to decode it.
            if (typeof to === "number") {
                to = String(to);
            }

            to = options.format.from(to);
            to = scope_Spectrum.toStepping(to);

            // If parsing the number failed, use the current value.
            if (to === false || isNaN(to)) {
                return scope_Locations[handleNumber];
            }

            return to;
        }

        // Set the slider value.
        function valueSet(input, fireSetEvent) {
            var values = asArray(input);
            var isInit = scope_Locations[0] === undefined;

            // Event fires by default
            fireSetEvent = fireSetEvent === undefined ? true : !!fireSetEvent;

            // Animation is optional.
            // Make sure the initial values were set before using animated placement.
            if (options.animate && !isInit) {
                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
            }

            // First pass, without lookAhead but with lookBackward. Values are set from left to right.
            scope_HandleNumbers.forEach(function (handleNumber) {
                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false);
            });

            // Second pass. Now that all base values are set, apply constraints
            scope_HandleNumbers.forEach(function (handleNumber) {
                setHandle(handleNumber, scope_Locations[handleNumber], true, true);
            });

            setZindex();

            scope_HandleNumbers.forEach(function (handleNumber) {
                fireEvent("update", handleNumber);

                // Fire the event only for handles that received a new value, as per #579
                if (values[handleNumber] !== null && fireSetEvent) {
                    fireEvent("set", handleNumber);
                }
            });
        }

        // Reset slider to initial values
        function valueReset(fireSetEvent) {
            valueSet(options.start, fireSetEvent);
        }

        // Set value for a single handle
        function valueSetHandle(handleNumber, value, fireSetEvent) {
            // Ensure numeric input
            handleNumber = Number(handleNumber);

            if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
                throw new Error("noUiSlider (" + VERSION + "): invalid handle number, got: " + handleNumber);
            }

            // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
            setHandle(handleNumber, resolveToValue(value, handleNumber), true, true);

            fireEvent("update", handleNumber);

            if (fireSetEvent) {
                fireEvent("set", handleNumber);
            }
        }

        // Get the slider value.
        function valueGet() {
            var values = scope_Values.map(options.format.to);

            // If only one handle is used, return a single value.
            if (values.length === 1) {
                return values[0];
            }

            return values;
        }

        // Removes classes from the root and empties it.
        function destroy() {
            for (var key in options.cssClasses) {
                if (!options.cssClasses.hasOwnProperty(key)) {
                    continue;
                }
                removeClass(scope_Target, options.cssClasses[key]);
            }

            while (scope_Target.firstChild) {
                scope_Target.removeChild(scope_Target.firstChild);
            }

            delete scope_Target.noUiSlider;
        }

        function getNextStepsForHandle(handleNumber) {
            var location = scope_Locations[handleNumber];
            var nearbySteps = scope_Spectrum.getNearbySteps(location);
            var value = scope_Values[handleNumber];
            var increment = nearbySteps.thisStep.step;
            var decrement = null;

            // If snapped, directly use defined step value
            if (options.snap) {
                return [value - nearbySteps.stepBefore.startValue || null, nearbySteps.stepAfter.startValue - value || null];
            }

            // If the next value in this step moves into the next step,
            // the increment is the start of the next step - the current value
            if (increment !== false) {
                if (value + increment > nearbySteps.stepAfter.startValue) {
                    increment = nearbySteps.stepAfter.startValue - value;
                }
            }

            // If the value is beyond the starting point
            if (value > nearbySteps.thisStep.startValue) {
                decrement = nearbySteps.thisStep.step;
            } else if (nearbySteps.stepBefore.step === false) {
                decrement = false;
            }

            // If a handle is at the start of a step, it always steps back into the previous step first
            else {
                    decrement = value - nearbySteps.stepBefore.highestStep;
                }

            // Now, if at the slider edges, there is no in/decrement
            if (location === 100) {
                increment = null;
            } else if (location === 0) {
                decrement = null;
            }

            // As per #391, the comparison for the decrement step can have some rounding issues.
            var stepDecimals = scope_Spectrum.countStepDecimals();

            // Round per #391
            if (increment !== null && increment !== false) {
                increment = Number(increment.toFixed(stepDecimals));
            }

            if (decrement !== null && decrement !== false) {
                decrement = Number(decrement.toFixed(stepDecimals));
            }

            return [decrement, increment];
        }

        // Get the current step size for the slider.
        function getNextSteps() {
            return scope_HandleNumbers.map(getNextStepsForHandle);
        }

        // Updateable: margin, limit, padding, step, range, animate, snap
        function updateOptions(optionsToUpdate, fireSetEvent) {
            // Spectrum is created using the range, snap, direction and step options.
            // 'snap' and 'step' can be updated.
            // If 'snap' and 'step' are not passed, they should remain unchanged.
            var v = valueGet();

            var updateAble = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips"];

            // Only change options that we're actually passed to update.
            updateAble.forEach(function (name) {
                // Check for undefined. null removes the value.
                if (optionsToUpdate[name] !== undefined) {
                    originalOptions[name] = optionsToUpdate[name];
                }
            });

            var newOptions = testOptions(originalOptions);

            // Load new options into the slider state
            updateAble.forEach(function (name) {
                if (optionsToUpdate[name] !== undefined) {
                    options[name] = newOptions[name];
                }
            });

            scope_Spectrum = newOptions.spectrum;

            // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
            options.margin = newOptions.margin;
            options.limit = newOptions.limit;
            options.padding = newOptions.padding;

            // Update pips, removes existing.
            if (options.pips) {
                pips(options.pips);
            } else {
                removePips();
            }

            // Update tooltips, removes existing.
            if (options.tooltips) {
                tooltips();
            } else {
                removeTooltips();
            }

            // Invalidate the current positioning so valueSet forces an update.
            scope_Locations = [];
            valueSet(optionsToUpdate.start || v, fireSetEvent);
        }

        // Initialization steps
        function setupSlider() {
            // Create the base element, initialize HTML and set classes.
            // Add handles and connect elements.
            scope_Base = addSlider(scope_Target);

            addElements(options.connect, scope_Base);

            // Attach user events.
            bindSliderEvents(options.events);

            // Use the public value method to set the start values.
            valueSet(options.start);

            if (options.pips) {
                pips(options.pips);
            }

            if (options.tooltips) {
                tooltips();
            }

            aria();
        }

        setupSlider();

        // noinspection JSUnusedGlobalSymbols
        scope_Self = {
            destroy: destroy,
            steps: getNextSteps,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            setHandle: valueSetHandle,
            reset: valueReset,
            // Exposed for unit testing, don't use this in your application.
            __moveHandles: function __moveHandles(a, b, c) {
                moveHandles(a, b, scope_Locations, c);
            },
            options: originalOptions, // Issue #600, #678
            updateOptions: updateOptions,
            target: scope_Target, // Issue #597
            removePips: removePips,
            removeTooltips: removeTooltips,
            pips: pips // Issue #594
        };

        return scope_Self;
    }

    // Run the standard initializer
    function initialize(target, originalOptions) {
        if (!target || !target.nodeName) {
            throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
        }

        // Throw an error if the slider was already initialized.
        if (target.noUiSlider) {
            throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
        }

        // Test the options and create the slider environment;
        var options = testOptions(originalOptions, target);
        var api = scope(target, options, originalOptions);

        target.noUiSlider = api;

        return api;
    }

    // Use an object instead of a function for future expandability;
    return {
        // Exposed for unit testing, don't use this in your application.
        __spectrum: Spectrum,
        version: VERSION,
        create: initialize
    };
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dispatcher = d3.dispatch('clickYear');
var CLOSER_MODE_TRESHOLD = 4;

var D3gtd_visblock = exports.D3gtd_visblock = function () {
  function D3gtd_visblock(options) {
    _classCallCheck(this, D3gtd_visblock);

    this.container = d3.select('#' + options.column).classed('d3gtc-container-vis', true).style('overflow', 'hidden');

    this.donutContainer1 = d3.select('#' + options.donut1).classed('d3gtc-donut1', true).style('overflow', 'hidden');

    this.donutContainer1.append('svg');

    this.donutContainer2 = d3.select('#' + options.donut2).classed('d3gtc-donut1', true).style('overflow', 'hidden');

    this.donutContainer2.append('svg');

    this.container.append('div').classed('d3gtc-charts', true);
    // .append('div')
    // .classed('d3gtc-charts-desc', true)
    // .text('Click on country to show more information');

    this.container.select('.d3gtc-charts').append('div').classed('d3gtc-linechart', true).append("svg");

    this.container.select('.d3gtc-charts').append('div').classed('d3gtc-barchart', true).append("svg");

    this.barchart = this.container.select('.d3gtc-barchart').select('svg');
    this.barchart.append('text').text('People killed in terrorist attacks pro year').attr('y', '22').attr('x', this.container.node().getBoundingClientRect().width / 2).attr('font-size', '14px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.barchart.append('text').text('Deaths').attr('y', '30').attr('x', '34').attr('font-size', '10px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.barchart.append('text').text('Date').attr('y', '257').attr('x', this.container.node().getBoundingClientRect().width - 25).attr('font-size', '10px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.linechart = this.container.select('.d3gtc-linechart').select('svg');
    this.linechart.append('text').text('Incidents').attr('y', '30').attr('x', '34').attr('font-size', '10px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.linechart.append('text').text('Date').attr('y', '257').attr('x', this.container.node().getBoundingClientRect().width - 25).attr('font-size', '10px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.linechart.append('text').text('Amount of incidents pro year').attr('y', '22').attr('x', this.container.node().getBoundingClientRect().width / 2).attr('font-size', '14px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.donutAttack = this.donutContainer1.select('svg');
    this.donutAttack.append('text').text('Types of attack').attr('y', '22').attr('x', this.donutContainer1.node().getBoundingClientRect().width / 2).attr('font-size', '14px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.donutTarget = this.donutContainer2.select('svg');
    this.donutTarget.append('text').text('Types of targets').attr('y', '22').attr('x', this.donutContainer2.node().getBoundingClientRect().width / 2).attr('font-size', '14px').attr('font-weight', '700').attr('text-anchor', 'middle');
    this.currentIndex = 0;
    this.data = [];
    this.countries = [];
  }

  _createClass(D3gtd_visblock, [{
    key: 'toggleActive',
    value: function toggleActive() {
      this.container.classed('active', !this.container.classed('active'));
    }
  }, {
    key: 'setTimeInterval',
    value: function setTimeInterval(timeInterval) {
      this.timeInterval = timeInterval;
      var isCloserMode = (this.timeInterval[1] - this.timeInterval[0]) / 1000 / 60 / 60 / 24 / 30 / 12 <= CLOSER_MODE_TRESHOLD;

      // set the ranges
      if (!this.x) {
        this.x = d3.scaleTime();
      }
      var start = new Date(timeInterval[0]);
      var end = new Date(timeInterval[1]);
      if (!isCloserMode) {
        start.setMonth(0);
        end.setMonth(0);
      }
      start.setDate(0);
      end.setDate(0);
      this.x.domain([start, end]);

      this.data = [];
      this.currentIndex = 0;
    }
  }, {
    key: 'setCountry',
    value: function setCountry(d, patchedUpChartsData) {
      this.countries[this.currentIndex] = d;
      this.data[this.currentIndex] = {
        country: d,
        data: patchedUpChartsData
      };
      // this.container.select('.d3gtc-charts-desc').text('Selected country: ' + d.properties.name);
      this.container.select('.d3gtc-barchart').classed('active', true);
      this.container.select('.d3gtc-linechart').classed('active', true);
      this.donutContainer1.classed('active', true);
      this.container.select('.d3gtc-donut2').classed('active', true);
      this.updateCharts();
      this.currentIndex = (this.currentIndex + 1) % 2;
    }
  }, {
    key: 'getCountries',
    value: function getCountries() {
      return this.countries;
    }
  }, {
    key: 'updateCharts',
    value: function updateCharts() {
      this.updateLinechart();
      this.updateBarchart();
      this.updateDonutAttackType();
      this.updateDonutTargetType();
    }
  }, {
    key: 'updateLinechart',
    value: function updateLinechart() {
      var _this2 = this;

      var widthBasis = this.container.select('.d3gtc-linechart').node().getBoundingClientRect().width;
      var heightBasis = widthBasis / 1.5;
      var margin = { top: 40, right: 40, bottom: 80, left: 40 },
          width = widthBasis - margin.left - margin.right,
          height = heightBasis - margin.top - margin.bottom;

      this.container.select('.d3gtc-linechart').select('g').remove();

      this.container.select('.d3gtc-linechart').select('g').remove();

      var linechartG = this.linechart.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var maxValue = 0;
      var isCloserMode = (this.timeInterval[1] - this.timeInterval[0]) / 1000 / 60 / 60 / 24 / 30 / 12 <= CLOSER_MODE_TRESHOLD;

      var linechartData = this.data.map(function (lineData) {
        if (!isCloserMode) {
          var data = d3.nest().key(function (d) {
            return d.iyear;
          }).rollup(function (d) {
            return d.length;
          }).entries(lineData.data);
          maxValue = Math.max(maxValue, d3.max(data, function (d) {
            return d.value;
          }));
          return data.map(function (d) {
            return Object.assign(d, {
              date: parseDate(d.key),
              country: lineData.country.properties.name
            });
          });
        } else {
          var data = d3.nest().key(function (d) {
            return d.iyear + '-' + d.imonth;
          }).sortKeys(function (a, b) {
            if (parseInt(a.split('-')[0]) != parseInt(b.split('-')[0])) {
              return parseInt(a.split('-')[0]) >= parseInt(b.split('-')[0]) ? 1 : -1;
            } else {
              return parseInt(a.split('-')[1]) >= parseInt(b.split('-')[1]) ? 1 : -1;
            }
          }).rollup(function (d) {
            return d.length;
          }).entries(lineData.data);
          maxValue = Math.max(maxValue, d3.max(data, function (d) {
            return d.value;
          }));
          return data.map(function (d) {
            return Object.assign(d, {
              date: parseDateMonth(d.key),
              country: lineData.country.properties.name
            });
          });
        }
      });

      // Add 0-values
      linechartData.forEach(function (lineData) {
        if (!isCloserMode) {
          var minYear = new Date(_this2.timeInterval[0]).getFullYear();
          var maxYear = new Date(_this2.timeInterval[1]).getFullYear();
          for (var i = minYear; i <= maxYear; i++) {
            var found = false;
            for (var j = 0; j < lineData.length; j++) {
              if (lineData[j].key == i) {
                found = true;
                break;
              }
            }
            if (!found) {
              lineData.push({
                key: i + "",
                country: _this2.data[0].country.properties.name,
                date: parseDate(i),
                value: 0
              });
            }
          }
          lineData.sort(function (a, b) {
            return a.key >= b.key ? 1 : -1;
          });
        } else {
          var minYear = new Date(_this2.timeInterval[0]).getFullYear();
          var minMonth = new Date(_this2.timeInterval[0]).getMonth();
          var maxYear = new Date(_this2.timeInterval[1]).getFullYear();
          var maxMonth = new Date(_this2.timeInterval[1]).getMonth();
          for (var i = minYear; i <= maxYear; i++) {
            var startMonth = minYear == i ? 0 : minMonth;
            var endMonth = maxYear == i ? 11 : maxMonth;
            for (var m = startMonth; m <= endMonth; m++) {
              var found = false;
              for (var j = 0; j < lineData.length; j++) {
                if (lineData[j].key == i + '-' + (m + 1)) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                lineData.push({
                  key: i + '-' + (m + 1),
                  country: _this2.data[0].country.properties.name,
                  date: parseDateMonth(i),
                  value: 0
                });
              }
            }
          }
          lineData.sort(function (a, b) {
            if (parseInt(a.key.split('-')[0]) != parseInt(b.key.split('-')[0])) {
              return parseInt(a.key.split('-')[0]) >= parseInt(b.key.split('-')[0]) ? 1 : -1;
            } else {
              return parseInt(a.key.split('-')[1]) >= parseInt(b.key.split('-')[1]) ? 1 : -1;
            }
          });
        }
      });
      // if (linechartData[1] && linechartData[0].length != linechartData[1].length){
      //   var biggerIndex = linechartData[0].length >= linechartData[1].length ? 0
      // }
      this.x.range([0, width]);

      var y = d3.scaleLinear().range([height, 0]).domain([0, maxValue]);

      var xAxis = d3.axisBottom(this.x);
      if (!isCloserMode) {
        xAxis.tickFormat(d3.timeFormat("%Y"));
      } else {
        xAxis.tickFormat(d3.timeFormat("%b %Y"));
      }

      var yAxis = d3.axisLeft(y).ticks(10);

      linechartG.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.55em").attr("transform", "rotate(-90)");

      linechartG.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Value ($)");

      var colors = ['steelblue', '#fdbb84'];

      var line = d3.line().x(function (d) {
        return _this2.x(new Date(d.key));
      }).y(function (d) {
        return y(d.value);
      }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX); // apply smoothing to the line

      linechartData.forEach(function (el, i) {

        linechartG.append("path").datum(el) // 10. Binds data to the line 
        .attr('fill', 'none').attr('stroke', colors[i]).attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

        linechartG.selectAll(".dot" + i).data(el).enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("fill", colors[i]) // Assign a class for styling
        .attr("cx", function (d) {
          return _this2.x(new Date(d.key));
        }).attr("cy", function (d) {
          return y(d.value);
        }).attr("r", 3).on('click', function (d) {
          dispatcher.call("clickYear", _this2, d.key);
          clearTolltips();
        }).on('mouseover', function (d) {
          showTooltip(d);
        }).on('mousemove', function (d) {
          updateTooltipPosition(d);
        }).on('mouseleave', function (d) {
          clearTolltips();
        });
      });

      var tooltip = null;

      var tooltipMarkup = function tooltipMarkup(data) {
        var year = data.key.split('-')[1] ? data.key.split('-')[0] : data.key;
        return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + data.country + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Year: <span>' + year + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of incidents: <span>' + data.value + '</span> \
                </div> \
              </div>';
      };

      var showTooltip = function showTooltip(d) {
        if (!tooltipMarkup) return;
        tooltip = _this2.container.append('div').attr('class', 'donut-tooltip').html(tooltipMarkup(d)).style('position', 'fixed').style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px').style('transform', 'translate(-50%, 20px)').style('z-index', 100);
      };

      var updateTooltipPosition = function updateTooltipPosition(data) {
        tooltip.style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px');
      };

      var clearTolltips = function clearTolltips() {
        tooltip && tooltip.remove();
      };

      var legendContainer = this.container.select('.d3gtc-linechart').select('.d3gtc-linechart--legend');
      if (legendContainer.size() == 0) {
        legendContainer = this.container.select('.d3gtc-linechart').style('position', 'relative').append('div').attr('class', 'd3gtc-linechart--legend').style('position', 'absolute').style('left', '50%').style('bottom', '18px').style('transform', 'translateX(-50%)');
      }

      legendContainer.selectAll('.legend').remove();
      console.dir(this.countries);

      legendContainer.selectAll('.legend').data(this.countries).enter().append('div').attr('class', 'legend').style('position', 'relative').style('display', 'inline-block').style('margin', '0 12px').style('padding-left', '15px').each(function (d, i) {
        d3.select(this).append('div').attr('class', 'legend-marker').style('position', 'absolute').style('width', '10px').style('height', '10px').style('left', '0').style('top', '2px').style('background', colors[i]);

        d3.select(this).append('div').attr('class', 'legend-text').style('font-size', '12px').text(function (d) {
          return d.properties.name;
        });
      });
    }
  }, {
    key: 'updateBarchart',
    value: function updateBarchart() {
      var _this3 = this;

      var widthBasis = this.container.select('.d3gtc-barchart').node().getBoundingClientRect().width;
      var heightBasis = widthBasis / 1.5;
      var margin = { top: 40, right: 40, bottom: 80, left: 40 },
          width = widthBasis - margin.left - margin.right,
          height = heightBasis - margin.top - margin.bottom;

      this.container.select('.d3gtc-barchart').select('g').remove();

      this.container.select('.d3gtc-barchart').select('g').remove();

      var linechartG = this.barchart.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var maxValue = 0;
      var isCloserMode = (this.timeInterval[1] - this.timeInterval[0]) / 1000 / 60 / 60 / 24 / 30 / 12 <= CLOSER_MODE_TRESHOLD;

      var linechartData = this.data.map(function (lineData) {
        if (!isCloserMode) {
          var data = d3.nest().key(function (d) {
            return d.iyear;
          }).rollup(function (d) {
            return d3.sum(d, function (d) {
              return d.nkill;
            });
          }).entries(lineData.data);
          maxValue = Math.max(maxValue, d3.max(data, function (d) {
            return d.value;
          }));
          return data.map(function (d) {
            return Object.assign(d, {
              date: parseDate(d.key),
              country: lineData.country.properties.name
            });
          });
        } else {
          var data = d3.nest().key(function (d) {
            return d.iyear + '-' + d.imonth;
          }).sortKeys(function (a, b) {
            if (parseInt(a.split('-')[0]) != parseInt(b.split('-')[0])) {
              return parseInt(a.split('-')[0]) >= parseInt(b.split('-')[0]) ? 1 : -1;
            } else {
              return parseInt(a.split('-')[1]) >= parseInt(b.split('-')[1]) ? 1 : -1;
            }
          }).rollup(function (d) {
            return d3.sum(d, function (d) {
              return d.nkill;
            });
          }).entries(lineData.data);
          maxValue = Math.max(maxValue, d3.max(data, function (d) {
            return d.value;
          }));
          return data.map(function (d) {
            return Object.assign(d, {
              date: parseDateMonth(d.key),
              country: lineData.country.properties.name
            });
          });
        }
      });

      // Add 0-values
      linechartData.forEach(function (lineData) {
        if (!isCloserMode) {
          var minYear = new Date(_this3.timeInterval[0]).getFullYear();
          var maxYear = new Date(_this3.timeInterval[1]).getFullYear();
          for (var i = minYear; i <= maxYear; i++) {
            var found = false;
            for (var j = 0; j < lineData.length; j++) {
              if (lineData[j].key == i) {
                found = true;
                break;
              }
            }
            if (!found) {
              lineData.push({
                key: i + "",
                country: _this3.data[0].country.properties.name,
                date: parseDate(i),
                value: 0
              });
            }
          }
          lineData.sort(function (a, b) {
            return a.key >= b.key ? 1 : -1;
          });
        } else {
          var minYear = new Date(_this3.timeInterval[0]).getFullYear();
          var minMonth = new Date(_this3.timeInterval[0]).getMonth();
          var maxYear = new Date(_this3.timeInterval[1]).getFullYear();
          var maxMonth = new Date(_this3.timeInterval[1]).getMonth();
          for (var i = minYear; i <= maxYear; i++) {
            var startMonth = minYear == i ? 0 : minMonth;
            var endMonth = maxYear == i ? 11 : maxMonth;
            for (var m = startMonth; m <= endMonth; m++) {
              var found = false;
              for (var j = 0; j < lineData.length; j++) {
                if (lineData[j].key == i + '-' + (m + 1)) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                lineData.push({
                  key: i + '-' + (m + 1),
                  country: _this3.data[0].country.properties.name,
                  date: parseDateMonth(i),
                  value: 0
                });
              }
            }
          }
          lineData.sort(function (a, b) {
            if (parseInt(a.key.split('-')[0]) != parseInt(b.key.split('-')[0])) {
              return parseInt(a.key.split('-')[0]) >= parseInt(b.key.split('-')[0]) ? 1 : -1;
            } else {
              return parseInt(a.key.split('-')[1]) >= parseInt(b.key.split('-')[1]) ? 1 : -1;
            }
          });
        }
      });
      // if (linechartData[1] && linechartData[0].length != linechartData[1].length){
      //   var biggerIndex = linechartData[0].length >= linechartData[1].length ? 0
      // }
      this.x.range([0, width]);

      var y = d3.scaleLinear().range([height, 0]).domain([0, maxValue]);

      var xAxis = d3.axisBottom(this.x);
      if (!isCloserMode) {
        xAxis.tickFormat(d3.timeFormat("%Y"));
      } else {
        xAxis.tickFormat(d3.timeFormat("%b %Y"));
      }

      var yAxis = d3.axisLeft(y).ticks(10);

      linechartG.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", "-.55em").attr("transform", "rotate(-90)");

      linechartG.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Value ($)");

      var colors = ['steelblue', '#fdbb84'];

      var line = d3.line().x(function (d) {
        return _this3.x(new Date(d.key));
      }).y(function (d) {
        return y(d.value);
      }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX); // apply smoothing to the line

      linechartData.forEach(function (el, i) {

        linechartG.append("path").datum(el) // 10. Binds data to the line 
        .attr('fill', 'none').attr('stroke', colors[i]).attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

        linechartG.selectAll(".dot" + i).data(el).enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("fill", colors[i]) // Assign a class for styling
        .attr("cx", function (d) {
          return _this3.x(new Date(d.key));
        }).attr("cy", function (d) {
          return y(d.value);
        }).attr("r", 3).on('click', function (d) {
          dispatcher.call("clickYear", _this3, d.key);
          clearTolltips();
        }).on('mouseover', function (d) {
          showTooltip(d);
        }).on('mousemove', function (d) {
          updateTooltipPosition(d);
        }).on('mouseleave', function (d) {
          clearTolltips();
        });
      });

      var tooltip = null;

      var tooltipMarkup = function tooltipMarkup(data) {
        var year = data.key.split('-')[1] ? data.key.split('-')[0] : data.key;
        return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + data.country + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Year: <span>' + year + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of deaths: <span>' + data.value + '</span> \
                </div> \
              </div>';
      };

      var showTooltip = function showTooltip(d) {
        if (!tooltipMarkup) return;
        tooltip = _this3.container.append('div').attr('class', 'donut-tooltip').html(tooltipMarkup(d)).style('position', 'fixed').style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px').style('transform', 'translate(-50%, 20px)').style('z-index', 100);
      };

      var updateTooltipPosition = function updateTooltipPosition(data) {
        tooltip.style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px');
      };

      var clearTolltips = function clearTolltips() {
        tooltip && tooltip.remove();
      };

      var legendContainer = this.container.select('.d3gtc-barchart').select('.d3gtc-linechart--legend');
      if (legendContainer.size() == 0) {
        legendContainer = this.container.select('.d3gtc-barchart').style('position', 'relative').append('div').attr('class', 'd3gtc-linechart--legend').style('position', 'absolute').style('left', '50%').style('bottom', '18px').style('transform', 'translateX(-50%)');
      }

      legendContainer.selectAll('.legend').remove();

      legendContainer.selectAll('.legend').data(this.countries).enter().append('div').attr('class', 'legend').style('position', 'relative').style('display', 'inline-block').style('margin', '0 12px').style('padding-left', '15px').each(function (d, i) {
        d3.select(this).append('div').attr('class', 'legend-marker').style('position', 'absolute').style('width', '10px').style('height', '10px').style('left', '0').style('top', '2px').style('background', colors[i]);

        d3.select(this).append('div').attr('class', 'legend-text').style('font-size', '12px').text(function (d) {
          return d.properties.name;
        });
      });
    }
  }, {
    key: 'updateDonutAttackType',
    value: function updateDonutAttackType() {
      var _this4 = this;

      var widthBasis = this.donutContainer1.node().getBoundingClientRect().width;
      var heightBasis = widthBasis / 1.5;
      var margin = { top: 60, right: 20, bottom: 20, left: 20 },
          width = widthBasis,
          height = heightBasis;

      this.donutAttack.selectAll('g').remove();
      var maxLegendAmount = 10;
      var donutData = d3.nest().key(function (d) {
        return d.attacktype1_txt;
      }).rollup(function (d) {
        return d.length;
      }).entries(this.data[this.currentIndex % 2].data).slice(0, maxLegendAmount).sort(function (a, b) {
        return b.value - a.value;
      });

      // a circle chart needs a radius
      var radius = width / 4 - margin.left;

      // legend dimensions
      var legendRectSize = 5; // defines the size of the colored squares in legend
      var legendSpacing = 10; // defines spacing between squares

      // define color scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

      var svg = this.donutAttack.attr('width', width) // set the width of the svg element we just added
      .attr('height', height) // set the height of the svg element we just added
      .append('g') // append 'g' element to the svg element
      .attr("transform", "translate(" + (margin.left + radius) + "," + (margin.top + radius) + ")");

      var arc = d3.arc().innerRadius(0) // none for pie chart
      .outerRadius(radius); // size of overall chart

      var pie = d3.pie() // start and end angles of the segments
      .value(function (d) {
        return d.value;
      }) // how to extract the numerical data from each entry in our dataset
      .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

      // creating the chart
      var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
      .data(pie(donutData)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
      .enter() //creates placeholder nodes for each of the values
      .append('path') // replace placeholders with path elements
      .attr('d', arc) // define d attribute with arc function above
      .attr('fill', function (d) {
        return color(d.data.key);
      }) // use color scale to define fill of each label in dataset
      .each(function (d) {
        this._current - d;
      }).on('mouseover', function (d) {
        showTooltip(d);
      }).on('mousemove', function (d) {
        updateTooltipPosition(d);
      }).on('mouseleave', function (d) {
        clearTolltips();
      });

      var tooltip = null;
      var _this = this;

      var tooltipMarkup = function tooltipMarkup(data) {
        return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + _this.data[(_this.currentIndex + 1) % 2].country.properties.name + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Type of attack: <span>' + data.data.key + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of incidents: <span>' + data.value + '</span> \
                </div> \
              </div>';
      };

      var showTooltip = function showTooltip(d) {
        if (!tooltipMarkup) return;
        tooltip = _this4.container.append('div').attr('class', 'donut-tooltip').html(tooltipMarkup(d)).style('position', 'fixed').style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px').style('transform', 'translate(-50%, 20px)').style('z-index', 100);
      };

      var updateTooltipPosition = function updateTooltipPosition(data) {
        tooltip.style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px');
      };

      var clearTolltips = function clearTolltips() {
        tooltip.remove();
      };

      // define legend
      var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
      .data(color.domain().slice(0, maxLegendAmount)) // refers to an array of labels from our dataset
      .enter() // creates placeholder
      .append('g') // replace placeholders with g elements
      .attr('class', 'legend') // each g is given a legend class
      .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
        var offset = height * color.domain().slice(0, maxLegendAmount).length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
        var horz = margin.left + radius + 0.01 * width; // the legend is shifted to the left to make room for the text
        var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
        return 'translate(' + horz + ',' + vert + ')'; //return translation       
      });

      // adding colored squares to legend
      legend.append('rect') // append rectangle squares to legend                                   
      .attr('width', legendRectSize) // width of rect size is defined above                        
      .attr('height', legendRectSize) // height of rect size is defined above                      
      .style('fill', color) // each fill is passed a color
      .style('stroke', color);

      // adding text to legend
      legend.append('text').attr('x', legendRectSize + legendSpacing).attr('y', legendRectSize + legendSpacing / 2 - 4).style('font-size', 10).text(function (d) {
        return d.replace(/ *\([^)]*\) */g, "");
      }); // return label
    }
  }, {
    key: 'updateDonutTargetType',
    value: function updateDonutTargetType() {
      var _this5 = this;

      var widthBasis = this.donutContainer2.node().getBoundingClientRect().width;
      var heightBasis = widthBasis / 1.5;
      var margin = { top: 60, right: 20, bottom: 20, left: 20 },
          width = widthBasis,
          height = heightBasis;

      this.donutTarget.selectAll('g').remove();
      var maxLegendAmount = 10;

      var donutData = d3.nest().key(function (d) {
        return d.targtype1_txt;
      }).rollup(function (d) {
        return d.length;
      }).entries(this.data[this.currentIndex % 2].data).slice(0, maxLegendAmount).sort(function (a, b) {
        return b.value - a.value;
      });

      // a circle chart needs a radius
      var radius = width / 4 - margin.left;

      // legend dimensions
      var legendRectSize = 5; // defines the size of the colored squares in legend
      var legendSpacing = 10; // defines spacing between squares

      // define color scale
      var color = d3.scaleOrdinal(d3.schemeCategory10);
      // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

      var svg = this.donutTarget.attr('width', width) // set the width of the svg element we just added
      .attr('height', height) // set the height of the svg element we just added
      .append('g') // append 'g' element to the svg element
      .attr("transform", "translate(" + (margin.left + radius) + "," + (margin.top + radius) + ")");

      var arc = d3.arc().innerRadius(0) // none for pie chart
      .outerRadius(radius); // size of overall chart

      var pie = d3.pie() // start and end angles of the segments
      .value(function (d) {
        return d.value;
      }) // how to extract the numerical data from each entry in our dataset
      .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

      // creating the chart
      var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
      .data(pie(donutData)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
      .enter() //creates placeholder nodes for each of the values
      .append('path') // replace placeholders with path elements
      .attr('d', arc) // define d attribute with arc function above
      .attr('fill', function (d) {
        return color(d.data.key);
      }) // use color scale to define fill of each label in dataset
      .each(function (d) {
        this._current - d;
      }).on('mouseover', function (d) {
        showTooltip(d);
      }).on('mousemove', function (d) {
        updateTooltipPosition(d);
      }).on('mouseleave', function (d) {
        clearTolltips();
      });

      var tooltip = null;
      var _this = this;

      var tooltipMarkup = function tooltipMarkup(data) {
        console.dir(data);
        console.dir(_this.currentIndex);
        console.dir(_this.data);

        return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + _this.data[(_this.currentIndex + 1) % 2].country.properties.name + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Type of attack: <span>' + data.data.key + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of incidents: <span>' + data.value + '</span> \
                </div> \
              </div>';
      };

      var showTooltip = function showTooltip(d) {
        if (!tooltipMarkup) return;
        tooltip = _this5.container.append('div').attr('class', 'donut-tooltip').html(tooltipMarkup(d)).style('position', 'fixed').style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px').style('transform', 'translate(-50%, 20px)').style('z-index', 100);
      };

      var updateTooltipPosition = function updateTooltipPosition(data) {
        tooltip.style('top', d3.event.clientY + 'px').style('left', d3.event.clientX + 'px');
      };

      var clearTolltips = function clearTolltips() {
        tooltip.remove();
      };

      // define legend
      var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
      .data(color.domain().slice(0, maxLegendAmount)) // refers to an array of labels from our dataset
      .enter() // creates placeholder
      .append('g') // replace placeholders with g elements
      .attr('class', 'legend') // each g is given a legend class
      .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
        var offset = height * color.domain().slice(0, maxLegendAmount).length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
        var horz = margin.left + radius + 0.01 * width; // the legend is shifted to the left to make room for the text
        var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
        return 'translate(' + horz + ',' + vert + ')'; //return translation       
      });

      // adding colored squares to legend
      legend.append('rect') // append rectangle squares to legend                                   
      .attr('width', legendRectSize) // width of rect size is defined above                        
      .attr('height', legendRectSize) // height of rect size is defined above                      
      .style('fill', color) // each fill is passed a color
      .style('stroke', color);

      // adding text to legend
      legend.append('text').attr('x', legendRectSize + legendSpacing).attr('y', legendRectSize + legendSpacing / 2 - 4).style('font-size', 10).text(function (d) {
        return d.replace(/ *\([^)]*\) */g, "");
      }); // return label
    }
  }, {
    key: 'on',
    value: function on() {
      var value = dispatcher.on.apply(dispatcher, arguments);
      return value === dispatcher ? this : value;
    }
  }]);

  return D3gtd_visblock;
}();

// Parse the date / time


var parseDate = d3.timeParse("%Y");

var parseDateMonth = d3.timeParse("%Y-%m");

/***/ })
 ]);
//# sourceMappingURL=d3gtd.js.map