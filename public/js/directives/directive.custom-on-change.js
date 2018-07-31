angular.module("ppp")
.directive('customOnChange', function(){
	console.log("1")
	return {
		restrict: 'A',
		link: function(scope, element, attrs){ 
			element.bind('change', scope.$eval(attrs.customOnChange));
			console.log("2");
		}
	};
});