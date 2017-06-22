const TEMPLATE = `
  <div class="item-container" tabindex="-1" ng-click="$ctrl.applyFocused($event);"><span ng-transclude></span>
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

    ctrl.moveFocusToLeft = (evt) => {
      const previousElement = angular.element(evt.target.parentNode).prev();
      if(previousElement && previousElement[0]){
        ctrl.uiMultiSelectCtrl.applyFocused(previousElement.find('div.item-container'));
      }
    }

    ctrl.moveFocusToRight = (evt) => {
      const nextElement = angular.element(evt.target.parentNode).next();
      if(nextElement && nextElement[0]){
        ctrl.uiMultiSelectCtrl.applyFocused(nextElement.find('div.item-container'));
      }else{
        ctrl.uiMultiSelectCtrl.addFocusInput();
      }
    }

    document.addEventListener('keydown', evt => {
      if(evt.keyCode == 9 && ctrl.ngValue && $element.find('div.item-container').hasClass('item-focused')){
        ctrl.uiMultiSelectCtrl.addFocusInput();
        ctrl.uiMultiSelectCtrl.open();
      }
    })

    document.addEventListener('keyup', evt => {
      if(ctrl.ngValue && $element.find('div.item-container').hasClass('item-focused')){
        switch (evt.keyCode) {
          case 8:
            ctrl.uiMultiSelectCtrl.handlingBackspace(evt);
            break;
          case 9:
            ctrl.uiMultiSelectCtrl.addFocusInput();
            break;
          case 46:
            ctrl.uiMultiSelectCtrl.handlingBackspace(evt);
            break;
          case 37:
            ctrl.moveFocusToLeft(evt);
            break;
          case 39:
            ctrl.moveFocusToRight(evt);
            break;
        }
      }
    })

  }]
}

MultiSelectItem.$inject = [];

export default MultiSelectItem;
