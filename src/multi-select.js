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
             data-ng-model-options="{debounce: 1000}"
             data-ng-change="$ctrl.changeModel($ctrl.inputValue)"
             tabindex="0"
             ng-class="{'item-disabled' : $ctrl.ngDisabled}"
             data-ng-click="$ctrl.open($event)"
             data-ng-disabled="$ctrl.ngDisabled"
             data-ng-focus="$ctrl.removeFocusedItems();"
             data-ng-keyup="$ctrl.keyPress($event)"
             style="{{$ctrl.ngModel.length == 0 ? 'width: 100%' : ''}}" />
      <div class="progress indeterminate" ng-show="$ctrl.loading"></div>
      <ul ng-transclude="options" class="options">
      </ul>
      <span class="select-clearfix"></span>
    </div>
  `,
  bindings: {
    ngModel            : '=',
    ngDisabled         : '=?',
    closeOnSelectItem  : '=?',
    placeholder        : '@?',
    searchField        : '@?',
    tagging            : '&?',
    taggingModel       : '=?',
    searchOptions      : '&?', //metodo de buscar novas opções
    onSelected         : '&?', //evento ao selecionar um item
    onRemove           : '&?' //evento ao remover um item
  },
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element){
    let ctrl = this;

    ctrl.changeModel = value => {
      if(ctrl.searchOptions){
        ctrl.loading = true;
        if(value == undefined || value == null) value = '';
        ctrl.searchOptions({value: value}).then(resp => {
          ctrl.loading = false;
        }, err => {
          ctrl.loading = false;
        });
      }
    }

    ctrl.open = (evt) => {
      if(evt) evt.stopPropagation();
      const ul = $element.find('ul');
      if(ul && ul[0]){
        ul[0].classList.add('open');
        $timeout(()=>{
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
      if($element.find('ui-multi-select-option').find('li.option-container').length == 0){
        ctrl.changeModel();
      }
      angular.forEach($element.find('ui-multi-select-item div.item-container'), itemContainer => {
        angular.element(itemContainer).removeClass('item-focused');
      })
    }

    ctrl.removeFocusedOptions = () => {
      angular.forEach($element.find('ui-multi-select-option').find('li.option-container'), optionContainer => {
        angular.element(optionContainer).removeClass('option-focused');
      })
    }

    ctrl.removeFocusInput = () => {
      $element.find('input').blur();
    }

    ctrl.addFocusInput = (ignoreClick) => {
      $timeout(() => {
        if(!ignoreClick){
          $element.find('input').click();
        }
        $element.find('input').focus();
      },100)
    }

    ctrl.applyFocused = item => {
      ctrl.removeFocusedItems();
      angular.element(item).addClass('item-focused');
      angular.element(item).focus();
      ctrl.close();
    }

    ctrl.getLastItemEnabled = (item) => {
      if(item.find('div.item-container').hasClass('item-disabled')){
        return ctrl.getLastItemEnabled(item.prev());
      }
      return item;
    }

    ctrl.analyseIfContainsOtherItem = () => {
      $timeout(()=>{
        const items = ctrl.getLastItemEnabled($element.find('ui-multi-select-item').last());
        if(items && items[0]){
          ctrl.applyFocused(items.find('div.item-container'));
        }else{
          ctrl.addFocusInput();
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
      const items = ctrl.getLastItemEnabled($element.find('ui-multi-select-item').last());
      ctrl.applyFocusedOrRemoveItem(items, evt);
    }

    ctrl.getFirstOption = () => {
      return $element.find('ui-multi-select-option').find('li.option-container').first();
    }

    ctrl.getLastOption = () => {
      return $element.find('ui-multi-select-option').find('li.option-container').last();
    }

    const setScrollInOptionFocused = () => {
      const liFocused = $element.find('ui-multi-select-option').find('li.option-container.option-focused');
      if(liFocused && liFocused[0]){
        let container = $element.find('ul.options');
        let scrollTo  = liFocused;
        container.animate({
          scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
        }, 100);
      }
    }

    ctrl.nextOption = (evt, elm) => {
      evt.preventDefault();
      evt.stopPropagation();
      $timeout(()=>{
        const next = elm.next();
        if(next && next[0] && next.find('li')[0]){
          if(next.find('li.option-container')[0].classList.contains('option-disabled')){
            elm.find('li.option-container').removeClass('option-focused');
            ctrl.nextOption(evt, next);
          }else{
            elm.find('li.option-container').removeClass('option-focused');
            next.find('li.option-container').addClass('option-focused');
          }
        }else{
          if(next[0] && next[0].classList.contains('ng-isolate-scope')){
            elm.find('li.option-container').removeClass('option-focused');
            ctrl.nextOption(evt, next);
          }else{
            elm.find('li.option-container').removeClass('option-focused');
            ctrl.getFirstOption().addClass('option-focused');
          }
        }
        setScrollInOptionFocused();
      });
    }

    ctrl.prevOption = (evt, elm) => {
      evt.preventDefault();
      evt.stopPropagation();
      const previous = elm.prev();
      if(previous && previous[0] && previous.find('li')[0]){
        if(previous.find('li.option-container')[0].classList.contains('option-disabled')){
          elm.find('li.option-container').removeClass('option-focused');
          ctrl.prevOption(evt, previous);
        }else{
          elm.find('li.option-container').removeClass('option-focused');
          previous.find('li.option-container').addClass('option-focused');
        }
      } else{
        if((previous[0] && previous[0].classList.contains('ng-isolate-scope'))){
          elm.find('li.option-container').removeClass('option-focused');
          ctrl.prevOption(evt, previous);
        }else{
          elm.find('li.option-container').removeClass('option-focused');
          ctrl.getLastOption().addClass('option-focused');
        }
      }
      setScrollInOptionFocused();
    }

    ctrl.handligButtonUp = (evt) => {
      const liFocused = $element.find('ui-multi-select-option').find('li.option-container.option-focused');
      if(liFocused && liFocused[0]){
        ctrl.prevOption(evt, angular.element(liFocused[0].parentNode));
      }
    }

    ctrl.handligButtonDown = (evt) => {
      const liFocused = $element.find('ui-multi-select-option').find('li.option-container.option-focused');
      if(liFocused && liFocused[0]){
        ctrl.nextOption(evt, angular.element(liFocused[0].parentNode));
      }else{
        const options = $element.find('ui-multi-select-option').find('li.option-container.option-enabled');
        if(options.length > 0){
          options.first().addClass('option-focused');
        }
      }
    }

    ctrl.keyPress = evt => {
      evt.stopPropagation();
      switch (evt.keyCode) {
        case 8:
          if(!ctrl.inputOldValue){
            ctrl.close();
            ctrl.removeFocusInput();
            ctrl.handlingBackspace(evt);
          }
          break;
        case 37:
          if(!ctrl.inputOldValue){
            ctrl.removeFocusInput();
            ctrl.close();
            ctrl.handlingBackspace(evt);
          }
          break;
        case 40:
            evt.stopPropagation();
            if(!ctrl.opened){
              ctrl.open();
            }
            ctrl.handligButtonDown(evt);
          break;
        case 38:
            evt.stopPropagation();
            ctrl.handligButtonUp(evt);
            break;
        case 13:
            if(!ctrl.opened) return;
            const liFocused = $element.find('ui-multi-select-option').find('li.option-container.option-focused');
            if(liFocused && liFocused[0] && !liFocused.hasClass('ng-hide')){
              ctrl.addItem(liFocused.scope().$ctrl.ngValue, evt);
              ctrl.handligButtonUp(evt);
            }else{
              const value = $element.find('input').val();
              if (ctrl.tagging && ctrl.taggingModel && value && value.trim() != "") {
                let result = ctrl.tagging({
                  value: value
                });
                if (result != null && result != undefined) {
                  ctrl.addTagging(result);
                  ctrl.addItem(result, evt);
                  ctrl.inputValue = '';
                }
              }
            }
            break;
      }
      ctrl.inputOldValue = $element.find('input').val();
    }

    let listenerClick = document.addEventListener('click', event => $timeout(() => {
      ctrl.close()
    }));

    $scope.$on('$destroy', () => document.removeEventListener('click', listenerClick));

    ctrl.addTagging = (result) => {
      if(!ctrl.taggingModel.filter((tagging) => angular.equals(tagging, result)).length > 0){
        ctrl.taggingModel.push(result);
      }
    }

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

    $scope.$watch('$ctrl.ngDisabled', (disabled) => {
      if(!disabled) return;
      ctrl.removeFocusedItems();
      ctrl.removeFocusedOptions();
    })

    ctrl.addItem = (value, evt) => {
      ctrl.ngModel = ctrl.ngModel || [];
      ctrl.ngModel.push(value);
      if(ctrl.closeOnSelectItem == undefined || !ctrl.closeOnSelectItem){
        evt.stopPropagation();
      }
      if(ctrl.onSelected){
        ctrl.onSelected({value: value});
      }
    }

    ctrl.removeItem = (value, evt) => {
      if(ctrl.ngDisabled) return;
      $timeout(() => {
        ctrl.ngModel = ctrl.ngModel || [];
        ctrl.ngModel = ctrl.ngModel.filter(item => {
          return !angular.equals(item, value);
        });
      })
      if((ctrl.closeOnSelectItem == undefined || !ctrl.closeOnSelectItem) && evt){
        evt.stopPropagation();
      }
      if(ctrl.onRemove){
        ctrl.onRemove({value: value});
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
