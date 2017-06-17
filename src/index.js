//css
require('./multi-select.css');
//directives
import MultiSelect from  './multi-select';
import MultiSelectOption from  './multi-select-option';

((exports, angular) => {

  if(!angular){
    throw "ng-ui-multi-select require's AngularJS in window!!";
  }

  angular.module('ngUiMultiSelect', [])
        .component('uiMultiSelect', MultiSelect)
        .component('uiMultiSelectOption', MultiSelectOption)

  if(exports){
     exports = ngEasyInfiniteScroll;
  }

})( (window && window.module && window.module.exports) ? module.exports : undefined, (window && window.angular) ? window.angular : undefined);
