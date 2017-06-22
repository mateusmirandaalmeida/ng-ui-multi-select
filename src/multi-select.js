const _ = require('lodash');

const MultiSelect = {
  require: ['ngModel'],
  transclude: {
    'options': '?uiMultiSelectOption',
    'items': '?uiMultiSelectItem',
  },
  template:  `
    <div>
      <div ng-transclude="items"></div>
      <input placeholder="{{$ctrl.placeholder}}"
             data-ng-model="$ctrl.inputValue"
             tabindex="0"
             data-ng-click="$ctrl.open($event)"
             data-ng-focus="$ctrl.removeFocusedItems()"
             data-ng-keyup="$ctrl.keyPress($event)"
             style="{{$ctrl.ngModel.length == 0 ? 'width: 100%' : ''}}" />
      <ul ng-transclude="options">
      </ul>
      <span class="select-clearfix"></span>
    </div>
  `,
  bindings: {
    ngModel    : '=',
    closeOnSelectItem  : '=?',
    placeholder: '@?',
    searchField: '@?'
  },
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element){
    let ctrl = this;

    ctrl.open = (evt) => {
      if(evt) evt.stopPropagation();
      const ul = $element.find('ul');
      if(ul && ul[0]){
        ul[0].classList.add('open');
        setTimeout(()=>{
          ctrl.opened = true;
        }, 500)
      }
    }

    ctrl.close = () => {
      if(ctrl.opened){
        const ul = $element.find('ul');
        if(ul && ul[0]){
          ctrl.opened = false;
          ul[0].classList.remove('open');
        }
      }
    }

    ctrl.removeFocusedItems = () => {
      angular.forEach($element.find('ui-multi-select-item div.item-container'), itemContainer => {
        angular.element(itemContainer).removeClass('item-focused');
      })
    }

    ctrl.removeFocusInput = () => {
      $element.find('input').blur();
    }

    ctrl.addFocusInput = () => {
      $timeout(()=> {
        $element.find('input').click();
        $element.find('input').focus();
      },100)
    }

    ctrl.applyFocused = item => {
      ctrl.removeFocusedItems();
      angular.element(item).addClass('item-focused');
      angular.element(item).focus();
    }

    ctrl.analyseIfContainsOtherItem = () => {
      $timeout(()=>{
        const items = $element.find('ui-multi-select-item').last();
        if(items && items[0]){
          ctrl.applyFocused(items.find('.item-container'));
        }
      });
    }

    ctrl.applyFocusedOrRemoveItem = (items, evt) => {
      const item = angular.element(items[0]).find('.item-container');
      const itemScope = item.scope();
      if(item.hasClass('item-focused')){
        ctrl.removeItem(itemScope.$ctrl.ngValue, evt);
        ctrl.analyseIfContainsOtherItem();
        return;
      }
      ctrl.applyFocused(item);
    }

    ctrl.handlingBackspace = (evt) => {
      const itemFocused = $element.find('ui-multi-select-item div.item-container.item-focused');
      if(itemFocused && itemFocused[0]){
        ctrl.applyFocusedOrRemoveItem(angular.element(itemFocused[0].parentNode), evt);
        return;
      }
      const items = $element.find('ui-multi-select-item').last();
      ctrl.applyFocusedOrRemoveItem(items, evt);
    }

    ctrl.keyPress = evt => {
      $timeout(()=>{
        ctrl.removeFocusInput();
        switch (evt.keyCode) {
          case 8:
            if(!evt.target.value){
              ctrl.close();
              ctrl.handlingBackspace(evt);
            }
            break;
          case 37:
            if(!evt.target.value){
              ctrl.close();
              ctrl.handlingBackspace(evt);
            }
            break;
        }
      });;
    }

    let listenerClick = document.addEventListener('click', event => setTimeout(() => {
      ctrl.close()
    }));

    $scope.$on('$destroy', () => {
      document.removeEventListener('click', listenerClick);
    })

    ctrl.filterOptions = option => {
      if(!ctrl.inputValue) return false;
      let isObject = angular.isObject(option);
      if(ctrl.searchField && isObject){
        return _.get(option, ctrl.searchField).toString().toLowerCase().indexOf(ctrl.inputValue.toLowerCase()) == -1;
      }else if(!ctrl.searchField && isObject){
        let toReturn = true;
        Object.keys(option).forEach(key => {
          if(toReturn){
            toReturn = option[key].toString().toLowerCase().indexOf(ctrl.inputValue.toLowerCase()) == -1;
          }
        });
        return toReturn;
      }else{
        return option.indexOf(ctrl.inputValue) == -1;
      }
    }

    ctrl.addItem = (value, evt) => {
      ctrl.ngModel = ctrl.ngModel || [];
      ctrl.ngModel.push(value);
      if(ctrl.closeOnSelectItem == undefined || !ctrl.closeOnSelectItem){
        evt.stopPropagation();
      }
    }

    ctrl.removeItem = (value, evt) => {
      $timeout(()=>{
        ctrl.ngModel = ctrl.ngModel || [];
        ctrl.ngModel = ctrl.ngModel.filter(item => {
          return !angular.equals(item, value);
        });
      })
      if((ctrl.closeOnSelectItem == undefined || !ctrl.closeOnSelectItem) && evt){
        evt.stopPropagation();
      }
    }

    ctrl.itemIsSelect = item => {
      if(!ctrl.ngModel) return false;
      return ctrl.ngModel.filter(i => {
        return angular.equals(i, item);
      }).length > 0;
    }

  }]
}

export default MultiSelect;
