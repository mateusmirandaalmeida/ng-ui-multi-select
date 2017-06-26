const TEMPLATE = `
  <div class="item-container"
       tabindex="-1"
       data-ng-disabled="$ctrl.uiMultiSelectCtrl.ngDisabled || $ctrl.ngDisabled"
       data-ng-class="{'item-disabled' : ($ctrl.uiMultiSelectCtrl.ngDisabled || $ctrl.ngDisabled)}"
       data-ng-click="$ctrl.applyFocused($event);"><span ng-transclude></span>
    <i data-ng-click="$ctrl.removeItem($event)">X</i>
  </div>
`;

const MultiSelectItem = {
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

    ctrl.$onInit = () => {
    }

    ctrl.removeItem = ($event) => {
      if(ctrl.uiMultiSelectCtrl.ngDisabled || ctrl.ngDisabled) return;
      ctrl.uiMultiSelectCtrl.removeItem(ctrl.ngValue, $event);
    }

    ctrl.applyFocused = (evt) => {
      if(ctrl.uiMultiSelectCtrl.ngDisabled || ctrl.ngDisabled) return;
      ctrl.uiMultiSelectCtrl.applyFocused($element.find('div.item-container'));
    }

    const getPrev = (elm) => {
      if(elm.classList.contains('item-disabled')){
        if(elm.prev){
          return getPrev(elm.prev());
        }
        return;
      }
      return elm;
    }

    ctrl.moveFocusToLeft = (evt) => {
      const previousElement = angular.element(evt.target.parentNode).prev();
      if(previousElement && previousElement[0]){
        var prev = getPrev(previousElement.find('div.item-container')[0]);
        if(prev){
          ctrl.uiMultiSelectCtrl.applyFocused(prev);
        }
      }
    }

    const getNext = (elm) => {
      if(elm.classList.contains('item-disabled')){
        if(elm.next){
          return getNext(elm.next());
        }
        return;
      }
      return elm;
    }

    ctrl.moveFocusToRight = (evt) => {
      const nextElement = angular.element(evt.target.parentNode).next();
      if(nextElement && nextElement[0]){
        var next = getNext(nextElement.find('div.item-container')[0]);
        if(next){
          ctrl.uiMultiSelectCtrl.applyFocused(next);
        }
        return;
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
