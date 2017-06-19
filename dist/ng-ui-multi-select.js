/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var TEMPLATE = '\n  <div class="item-container"><span ng-transclude></span>\n    <i data-ng-click="$ctrl.uiMultiSelectCtrl.removeItem($ctrl.ngValue)">X</i>\n  </div>\n';

var MultiSelectItem = {
  transclude: true,
  template: TEMPLATE,
  require: {
    uiMultiSelectCtrl: '^uiMultiSelect'
  },
  bindings: {
    ngValue: '='
  },
  controller: ['$scope', '$attrs', '$timeout', '$element', function ($scope, $attrs, $timeout, $element) {
    var ctrl = this;
  }]
};

MultiSelectItem.$inject = [];

exports.default = MultiSelectItem;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var TEMPLATE = '\n  <li ng-transclude\n      ng-if="!$ctrl.uiMultiSelectCtrl.itemIsSelect($ctrl.ngValue)"\n      ng-hide="$ctrl.uiMultiSelectCtrl.filterOptions($ctrl.ngValue)"\n      data-ng-click="$ctrl.uiMultiSelectCtrl.addItem($ctrl.ngValue, $event)">\n  </li>\n';

var MultiSelectOption = {
  transclude: true,
  template: TEMPLATE,
  require: {
    uiMultiSelectCtrl: '^uiMultiSelect'
  },
  bindings: {
    ngValue: '='
  },
  controller: ['$scope', '$attrs', '$timeout', '$element', function ($scope, $attrs, $timeout, $element) {
    var ctrl = this;
  }]
};

MultiSelectOption.$inject = [];

exports.default = MultiSelectOption;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MultiSelect = {
  require: ['ngModel'],
  transclude: {
    'options': '?uiMultiSelectOption',
    'items': '?uiMultiSelectItem'
  },
  template: '\n    <div>\n      <div ng-transclude="items"></div>\n      <input placeholder="{{$ctrl.placeholder}}"\n             data-ng-model="$ctrl.inputValue"\n             data-ng-focus="$ctrl.open()"\n             style="{{$ctrl.ngModel.length == 0 ? \'width: 100%\' : \'\'}}" />\n      <ul ng-transclude="options">\n      </ul>\n    </div>\n  ',
  bindings: {
    ngModel: '=',
    placeholder: '@?',
    searchField: '@?'
  },
  controller: ['$scope', '$attrs', '$timeout', '$element', function ($scope, $attrs, $timeout, $element) {
    var ctrl = this;

    ctrl.open = function () {
      var ul = $element.find('ul');
      if (ul && ul[0]) {
        ul[0].classList.add('open');
        setTimeout(function () {
          ctrl.opened = true;
        }, 500);
      }
    };

    ctrl.close = function () {
      if (ctrl.opened) {
        var ul = $element.find('ul');
        if (ul && ul[0]) {
          ctrl.opened = false;
          ul[0].classList.remove('open');
        }
      }
    };

    var listenerClick = document.addEventListener('click', function (event) {
      return setTimeout(function () {
        ctrl.close();
      });
    });

    $scope.$on('$destroy', function () {
      document.removeEventListener('click', listenerClick);
    });

    ctrl.filterOptions = function (option) {
      if (!ctrl.inputValue) return false;
      var isObject = angular.isObject(option);
      if (ctrl.searchField && isObject) {} else if (!ctrl.searchField && isObject) {
        var toReturn = true;
        Object.keys(option).forEach(function (key) {
          if (toReturn) {
            toReturn = option[key].toString().toLowerCase().indexOf(ctrl.inputValue.toLowerCase()) == -1;
          }
        });
        return toReturn;
      } else {
        return option.indexOf(ctrl.inputValue) == -1;
      }
    };

    ctrl.addItem = function (value, evt) {
      ctrl.ngModel = ctrl.ngModel || [];
      ctrl.ngModel.push(value);
    };

    ctrl.removeItem = function (value) {
      ctrl.ngModel = ctrl.ngModel || [];
      ctrl.ngModel = ctrl.ngModel.filter(function (item) {
        return !angular.equals(item, value);
      });
    };

    ctrl.itemIsSelect = function (item) {
      if (!ctrl.ngModel) return false;
      return ctrl.ngModel.filter(function (i) {
        return angular.equals(i, item);
      }).length > 0;
    };
  }]
};

exports.default = MultiSelect;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _multiSelect = __webpack_require__(2);

var _multiSelect2 = _interopRequireDefault(_multiSelect);

var _multiSelectOption = __webpack_require__(1);

var _multiSelectOption2 = _interopRequireDefault(_multiSelectOption);

var _multiSelectItem = __webpack_require__(0);

var _multiSelectItem2 = _interopRequireDefault(_multiSelectItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//css
__webpack_require__(3);
//directives


(function (exports, angular) {

  if (!angular) {
    throw "ng-ui-multi-select require's AngularJS in window!!";
  }

  var module = angular.module('ngUiMultiSelect', []).component('uiMultiSelect', _multiSelect2.default).component('uiMultiSelectOption', _multiSelectOption2.default).component('uiMultiSelectItem', _multiSelectItem2.default);

  if (exports) {
    exports = module.name;
  }
})(window && window.module && window.module.exports ? module.exports : undefined, window && window.angular ? window.angular : undefined);

/***/ })
/******/ ]);