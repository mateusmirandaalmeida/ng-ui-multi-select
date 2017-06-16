//css
require('./multi-select.css');
//directives
import MultiSelect from  './multi-select';

((exports, angular) => {

  if(!angular){
    throw "ng-ui-multi-select require's AngularJS in window!!";
  }

  angular.module('ngUiMultiSelect', [])
        .directive('uiMultiSelect', MultiSelect);

  if(exports){
     exports = ngEasyInfiniteScroll;
  }

})( (window && window.module && window.module.exports) ? module.exports : undefined, (window && window.angular) ? window.angular : undefined);
