/* eslint-disable */
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  function getType(x) {
    // TODO make this faster ?
    return {}.toString.call(x);
  }

  function hasOwnKey(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
  }

  function copyObject(x) {
    var output = {}; // TODO use Object.keys ?

    for (var key in x) {
      if (hasOwnKey(x, key)) {
        output[key] = copy(x[key]);
      }
    }

    return output;
  }

  function copyArray(x) {
    var length = x.length;
    var output = new Array(length);

    for (var i = 0; i < length; ++i) {
      output[i] = copy(x[i]);
    }

    return output;
  } // TODO can this be made faster ?
  // TODO what about regexps, etc. ?


  function copy(x) {
    switch (getType(x)) {
      case "[object Array]":
        return copyArray(x);

      case "[object Object]":
        return copyObject(x);
      // TODO is this necessary ?

      case "[object Date]":
        return new Date(x.getTime());

      default:
        return x;
    }
  }

  function isNaN(x) {
    return x !== x;
  }

  function isNumberEqual(x, y) {
    return x === y || isNaN(x) && isNaN(y);
  }

  function removeChartListeners(chart, x, y) {
    if (x !== y) {
      // TODO is this necessary ?
      if (x == null) {
        x = [];
      } // TODO is this necessary ?


      if (y == null) {
        y = [];
      }

      var xLength = x.length;
      var yLength = y.length;

      for (var i = 0; i < xLength; ++i) {
        var xValue = x[i];
        var has = false; // TODO make this faster ?

        for (var j = 0; j < yLength; ++j) {
          var yValue = y[j]; // TODO is this correct ?

          if (xValue.event === yValue.event && xValue.method === yValue.method) {
            has = true;
            break;
          }
        }

        if (!has) {
          // TODO is this correct ?
          chart.removeListener(chart, xValue.event, xValue.method);
        }
      }
    }
  }

  function updateArray(a, x, y) {
    var didUpdate = false;

    if (x !== y) {
      var xLength = x.length;
      var yLength = y.length;

      if (xLength !== yLength) {
        a.length = yLength;
        didUpdate = true;
      }

      for (var i = 0; i < yLength; ++i) {
        if (i < xLength) {
          if (update(a, i, x[i], y[i])) {
            didUpdate = true;
          }
        } else {
          // TODO make this faster ?
          a[i] = copy(y[i]); // TODO is this necessary ?

          didUpdate = true;
        }
      }
    }

    return didUpdate;
  }

  function update(obj, key, x, y) {
    var didUpdate = false;

    if (x !== y) {
      var xType = getType(x);
      var yType = getType(y);

      if (xType === yType) {
        switch (xType) {
          case "[object Array]":
            if (updateArray(obj[key], x, y)) {
              didUpdate = true;
            }

            break;

          case "[object Object]":
            if (updateObject(obj[key], x, y)) {
              didUpdate = true;
            }

            break;

          case "[object Date]":
            if (x.getTime() !== y.getTime()) {
              // TODO make this faster ?
              obj[key] = copy(y);
              didUpdate = true;
            }

            break;

          case "[object Number]":
            if (!isNumberEqual(x, y)) {
              // TODO is the copy necessary ?
              obj[key] = copy(y);
              didUpdate = true;
            }

            break;

          default:
            if (x !== y) {
              // TODO is the copy necessary ?
              obj[key] = copy(y);
              didUpdate = true;
            }

            break;
        } // TODO is this correct ?

      } else {
        // TODO make this faster ?
        obj[key] = copy(y);
        didUpdate = true;
      }
    }

    return didUpdate;
  }

  function updateObject(chart, oldObj, newObj) {
    var didUpdate = false;

    if (oldObj !== newObj) {
      // TODO use Object.keys ?
      for (var key in newObj) {
        if (hasOwnKey(newObj, key)) {
          // TODO make this faster ?
          if (hasOwnKey(oldObj, key)) {
            // TODO should this count as an update ?
            if (key === "listeners") {
              // TODO make this faster ?
              removeChartListeners(chart, oldObj[key], newObj[key]);
            }

            if (update(chart, key, oldObj[key], newObj[key])) {
              didUpdate = true;
            }
          } else {
            // TODO make this faster ?
            chart[key] = copy(newObj[key]);
            didUpdate = true;
          }
        }
      } // TODO use Object.keys ?


      for (var key in oldObj) {
        if (hasOwnKey(oldObj, key) && !hasOwnKey(newObj, key)) {
          if (key === "listeners") {
            removeChartListeners(chart, oldObj[key], []);
          }

          delete chart[key];
          didUpdate = true;
        }
      }
    }

    return didUpdate;
  }

  var idSaved = 0;

  var React = require('react');

  AmCharts.React = function (props) {
    var firstRun = React.useRef(true);

    var _React$useState = React.useState("__AmCharts_React_" + ++idSaved + "__"),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        id = _React$useState2[0],
        setId = _React$useState2[1];

    var _React$useState3 = React.useState(null),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        chart = _React$useState4[0],
        setChart = _React$useState4[1];

    React.useEffect(function () {
      var copiedProps = copy(props);
      setChart(AmCharts.makeChart(id, copiedProps));
      return function () {
        if (chart) {
          chart.clear();
        }
      };
    }, []);
    React.useEffect(function () {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }

      var copiedProps = copy(props);
      AmCharts.makeChart(id, copiedProps); // chart.validateNow(true);
      // chart.validateData();
    }, [props]);
    return React.createElement('div', {
      id: id,
      style: {
        width: props.width || "100%",
        height: props.height || "100%"
      }
    }, null);
  };
})();