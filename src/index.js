//css
require('./multi-select.css');

//directives
import MultiSelect from  './multi-select';
import MultiSelectOption from  './multi-select-option';
import MultiSelectItem from  './multi-select-item';

if(!angular){
  throw "ng-ui-multi-select require's AngularJS in window!!";
}

const module = angular.module('ngUiMultiSelect', [])
      .component('uiMultiSelect', MultiSelect)
      .component('uiMultiSelectOption', MultiSelectOption)
      .component('uiMultiSelectItem', MultiSelectItem)

export default module.name;
