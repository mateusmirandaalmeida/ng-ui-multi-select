const MultiSelect = {
  require: ['ngModel'],
  transclude: true,
  template:  `
    <div>
      <input placeholder="{{placeholder}}" ng-focus="$ctrl.open()" ng-blur="$ctrl.close()" />
      <ul ng-transclude>
      </ul>
    </div>
  `,
  bindings: {
    ngModel    : '=',
    placeholder: '@'
  },
  controller: ['$scope','$attrs','$timeout','$element', function($scope,$attrs,$timeout,$element){
    let ctrl = this;

    ctrl.open = () => {
      const ul = $element.find('ul');
      if(ul && ul[0]){
        ul[0].classList.add('open');
      }
    }

    ctrl.close = () => {
      setTimeout(()=>{
        const ul = $element.find('ul');
        if(ul && ul[0]){
          ul[0].classList.remove('open');
        }
      }, 100);
    }

    ctrl.addItem = value => {
      ctrl.ngModel.push(value);
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
