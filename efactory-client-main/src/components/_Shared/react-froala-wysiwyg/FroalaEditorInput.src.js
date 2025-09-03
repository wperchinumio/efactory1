(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["FroalaEditorInput"] = factory(require("react"));
	else
		root["FroalaEditorInput"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FroalaEditorFunctionality = function (_React$Component) {
	  _inherits(FroalaEditorFunctionality, _React$Component);

	  function FroalaEditorFunctionality(props) {
	    _classCallCheck(this, FroalaEditorFunctionality);

	    // Tag on which the editor is initialized.
	    var _this = _possibleConstructorReturn(this, (FroalaEditorFunctionality.__proto__ || Object.getPrototypeOf(FroalaEditorFunctionality)).call(this, props));

	    _this.tag = null;
	    _this.defaultTag = 'div';
	    _this.listeningEvents = [];

	    // Jquery wrapped element.
	    _this.$element = null;

	    // Editor element.
	    _this.editor = null;

	    // Editor options config
	    _this.config = {
	      immediateReactModelUpdate: false,
	      reactIgnoreAttrs: null
	    };

	    _this.editorInitialized = false;

	    _this.SPECIAL_TAGS = ['img', 'button', 'input', 'a'];
	    _this.INNER_HTML_ATTR = 'innerHTML';
	    _this.hasSpecialTag = false;

	    _this.oldModel = null;
	    return _this;
	  }

	  // Before first time render.


	  _createClass(FroalaEditorFunctionality, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.tag = this.props.tag || this.defaultTag;
	    }

	    // After first time render.

	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {

	      var tagName = this.refs.el.tagName.toLowerCase();
	      if (this.SPECIAL_TAGS.indexOf(tagName) != -1) {

	        this.tag = tagName;
	        this.hasSpecialTag = true;
	      }

	      if (this.props.onManualControllerReady) {
	        this.generateManualController();
	      } else {
	        this.createEditor();
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.destroyEditor();
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {

	      if (JSON.stringify(this.oldModel) == JSON.stringify(this.props.model)) {
	        return;
	      }

	      this.setContent();
	    }
	  }, {
	    key: 'createEditor',
	    value: function createEditor() {

	      if (this.editorInitialized) {
	        return;
	      }

	      this.config = this.props.config || this.config;

	      this.$element = $(this.refs.el);

	      this.setContent(true);

	      this.registerEvents();
	      this.$editor = this.$element.froalaEditor(this.config).data('froala.editor').$el;
	      this.initListeners();

	      this.editorInitialized = true;
	    }
	  }, {
	    key: 'setContent',
	    value: function setContent(firstTime) {

	      if (!this.editorInitialized && !firstTime) {
	        return;
	      }

	      if (this.props.model || this.props.model == '') {

	        this.oldModel = this.props.model;

	        if (this.hasSpecialTag) {
	          this.setSpecialTagContent();
	        } else {
	          this.setNormalTagContent(firstTime);
	        }
	      }
	    }
	  }, {
	    key: 'setNormalTagContent',
	    value: function setNormalTagContent(firstTime) {

	      var self = this;

	      function htmlSet() {

	        self.$element.froalaEditor('html.set', self.props.model || '', true);
	        //This will reset the undo stack everytime the model changes externally. Can we fix this?
	        self.$element.froalaEditor('undo.reset');
	        self.$element.froalaEditor('undo.saveStep');
	      }

	      if (firstTime) {
	        this.registerEvent(this.$element, 'froalaEditor.initialized', function () {
	          htmlSet();
	        });
	      } else {
	        htmlSet();
	      }
	    }
	  }, {
	    key: 'setSpecialTagContent',
	    value: function setSpecialTagContent() {

	      var tags = this.props.model;

	      // add tags on element
	      if (tags) {

	        for (var attr in tags) {
	          if (tags.hasOwnProperty(attr) && attr != this.INNER_HTML_ATTR) {
	            this.$element.attr(attr, tags[attr]);
	          }
	        }

	        if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
	          this.$element[0].innerHTML = tags[this.INNER_HTML_ATTR];
	        }
	      }
	    }
	  }, {
	    key: 'destroyEditor',
	    value: function destroyEditor() {

	      if (this.$element) {

	        this.listeningEvents && this.$element.off(this.listeningEvents.join(" "));
	        this.$editor.off('keyup');
	        this.$element.froalaEditor('destroy');
	        this.listeningEvents.length = 0;
	        this.$element = null;
	        this.editorInitialized = false;
	      }
	    }
	  }, {
	    key: 'getEditor',
	    value: function getEditor() {

	      if (this.$element) {
	        return this.$element.froalaEditor.bind(this.$element);
	      }

	      return null;
	    }
	  }, {
	    key: 'generateManualController',
	    value: function generateManualController() {
	      var self = this;

	      var controls = {
	        initialize: function initialize() {
	          return self.createEditor.call(self);
	        },
	        destroy: function destroy() {
	          return self.destroyEditor.call(self);
	        },
	        getEditor: function getEditor() {
	          return self.getEditor.call(self);
	        }
	      };

	      this.props.onManualControllerReady(controls);
	    }
	  }, {
	    key: 'updateModel',
	    value: function updateModel() {

	      if (!this.props.onModelChange) {
	        return;
	      }

	      var modelContent = '';

	      if (this.hasSpecialTag) {

	        var attributeNodes = this.$element[0].attributes;
	        var attrs = {};

	        for (var i = 0; i < attributeNodes.length; i++) {

	          var attrName = attributeNodes[i].name;
	          if (this.config.reactIgnoreAttrs && this.config.reactIgnoreAttrs.indexOf(attrName) != -1) {
	            continue;
	          }
	          attrs[attrName] = attributeNodes[i].value;
	        }

	        if (this.$element[0].innerHTML) {
	          attrs[this.INNER_HTML_ATTR] = this.$element[0].innerHTML;
	        }

	        modelContent = attrs;
	      } else {

	        var returnedHtml = this.$element.froalaEditor('html.get');
	        if (typeof returnedHtml === 'string') {
	          modelContent = returnedHtml;
	        }
	      }

	      this.oldModel = modelContent;
	      this.props.onModelChange(modelContent);
	    }
	  }, {
	    key: 'initListeners',
	    value: function initListeners() {
	      var self = this;

	      // bind contentChange and keyup event to froalaModel
	      this.registerEvent(this.$element, 'froalaEditor.contentChanged', function () {
	        self.updateModel();
	      });
	      if (this.config.immediateReactModelUpdate) {
	        this.registerEvent(this.$editor, 'keyup', function () {
	          self.updateModel();
	        });
	      }
	    }

	    // register event on jquery editor element

	  }, {
	    key: 'registerEvent',
	    value: function registerEvent(element, eventName, callback) {

	      if (!element || !eventName || !callback) {
	        return;
	      }

	      this.listeningEvents.push(eventName);
	      element.on(eventName, callback);
	    }
	  }, {
	    key: 'registerEvents',
	    value: function registerEvents() {

	      var events = this.config.events;
	      if (!events) {
	        return;
	      }

	      for (var event in events) {
	        if (events.hasOwnProperty(event)) {
	          this.registerEvent(this.$element, event, events[event]);
	        }
	      }
	    }
	  }]);

	  return FroalaEditorFunctionality;
	}(_react2.default.Component);

	exports.default = FroalaEditorFunctionality;
	;

/***/ },
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _FroalaEditorFunctionality = __webpack_require__(3);

	var _FroalaEditorFunctionality2 = _interopRequireDefault(_FroalaEditorFunctionality);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FroalaEditorInput = function (_FroalaEditorFunction) {
	  _inherits(FroalaEditorInput, _FroalaEditorFunction);

	  function FroalaEditorInput() {
	    _classCallCheck(this, FroalaEditorInput);

	    return _possibleConstructorReturn(this, (FroalaEditorInput.__proto__ || Object.getPrototypeOf(FroalaEditorInput)).apply(this, arguments));
	  }

	  _createClass(FroalaEditorInput, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement('input', { ref: 'el' });
	    }
	  }]);

	  return FroalaEditorInput;
	}(_FroalaEditorFunctionality2.default);

	exports.default = FroalaEditorInput;

/***/ }
/******/ ])
});
;