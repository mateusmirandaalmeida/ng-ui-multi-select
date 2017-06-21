const TEMPLATE = `
  <div class="item-container" ng-click="$ctrl.applyFocused($event);"><span ng-transclude></span>
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


    ctrl.$onInit = () => {
    }

    ctrl.applyFocused = (evt) => {
      ctrl.uiMultiSelectCtrl.applyFocused($element.find('div.item-container'));
    }

  }]
}

MultiSelectItem.$inject = [];

export default MultiSelectItem;
