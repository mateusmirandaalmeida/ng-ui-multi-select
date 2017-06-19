const TEMPLATE = `
  <div class="item-container"><span ng-transclude></span>
    <i data-ng-click="$ctrl.uiMultiSelectCtrl.removeItem($ctrl.ngValue, $event)">X</i>
  </div>
`;

const MultiSelectItem = {
  transclude: true,
  template: TEMPLATE,
  require: {
    uiMultiSelectCtrl: '^uiMultiSelect'
  },
  bindings: {
    ngValue: '='
  },
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element){
    let ctrl = this;
  }]
}

MultiSelectItem.$inject = [];

export default MultiSelectItem;
