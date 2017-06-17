//css
require('./multi-select.css');
//directives
import MultiSelect from  './multi-select';
import MultiSelectOption from  './multi-select-option';
import MultiSelectItem from  './multi-select-item';

((exports, angular) => {

  if(!angular){
    throw "ng-ui-multi-select require's AngularJS in window!!";
  }

  angular.module('ngUiMultiSelect', [])
        .component('uiMultiSelect', MultiSelect)
        .component('uiMultiSelectOption', MultiSelectOption)
        .component('uiMultiSelectItem', MultiSelectItem)

  if(exports){
     exports = ngEasyInfiniteScroll;
  }

})( (window && window.module && window.module.exports) ? module.exports : undefined, (window && window.angular) ? window.angular : undefined);
