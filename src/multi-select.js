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
             data-ng-focus="$ctrl.open()"
             style="{{$ctrl.ngModel.length == 0 ? 'width: 100%' : ''}}" />
      <ul ng-transclude="options">
      </ul>
    </div>
  `,
  bindings: {
    ngModel    : '=',
    placeholder: '@?',
    searchField: '@?'
  },
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element){
    let ctrl = this;

    ctrl.open = () => {
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
    }

    ctrl.removeItem = (value) => {
      ctrl.ngModel = ctrl.ngModel || [];
      ctrl.ngModel = ctrl.ngModel.filter(item => {
        return !angular.equals(item, value);
      })
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
