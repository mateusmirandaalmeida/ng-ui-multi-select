const TEMPLATE = `
  <li ng-transclude
      class="option-container"
      tabindex="1"
      data-ng-class="{'option-disabled' : $ctrl.ngDisabled, 'option-enabled' : !$ctrl.ngDisabled}"
      data-ng-if="!$ctrl.uiMultiSelectCtrl.itemIsSelect($ctrl.ngValue)"
      data-ng-hide="$ctrl.uiMultiSelectCtrl.filterOptions($ctrl.ngValue)"
      data-ng-disabled="$ctrl.ngDisabled"
      data-ng-click="$ctrl.addItem($event)">
  </li>
`;

const MultiSelectOption = {
  transclude: true,
  template: TEMPLATE,
  require: {
    uiMultiSelectCtrl: '^uiMultiSelect'
  },
  bindings: {
    ngValue   : '=',
    ngDisabled: '=?'
  },
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element){
    let ctrl = this;

    ctrl.addItem = ($event) => {
      if(ctrl.ngDisabled){
        $event.stopPropagation();
        return;
      };
      ctrl.uiMultiSelectCtrl.addItem(ctrl.ngValue, $event);
      ctrl.uiMultiSelectCtrl.addFocusInput(true);
    }

  }]
}

MultiSelectOption.$inject = [];

export default MultiSelectOption;
