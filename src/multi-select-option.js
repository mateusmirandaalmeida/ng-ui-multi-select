const TEMPLATE = `
  <li ng-transclude
      ng-if="!$ctrl.uiMultiSelectCtrl.itemIsSelect($ctrl.ngValue)"
      ng-hide="$ctrl.uiMultiSelectCtrl.filterOptions($ctrl.ngValue)"
      data-ng-click="$ctrl.uiMultiSelectCtrl.addItem($ctrl.ngValue, $event)">
  </li>
`;

const MultiSelectOption = {
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

MultiSelectOption.$inject = [];

export default MultiSelectOption;
