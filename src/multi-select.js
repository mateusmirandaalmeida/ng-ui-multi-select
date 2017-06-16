const TEMPLATE = `

  <div>
    <input placeholder="{{placeholder}}"/>

    <ul ng-transclude>
    </ul>

  </div>

`;

const MultiSelect = () => {

  const controller = (scope, elm, attrs) => {
    console.log('oi');
  }

  return {
    restrict : 'E',
    priority : 100,
    template: TEMPLATE,
    scope: {
      placeholder: '@'
    },
    link:controller
  }

}

MultiSelect.$inject = [];

export default MultiSelect;
