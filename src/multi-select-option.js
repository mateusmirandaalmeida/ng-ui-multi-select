const TEMPLATE = `
  <li ng-transclude
      ng-if="!$ctrl.uiMultiSelectCtrl.itemIsSelect($ctrl.ngValue)"
      data-ng-click="$ctrl.uiMultiSelectCtrl.addItem($ctrl.ngValue)">
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
