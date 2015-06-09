angular.module('directive.countrySelector', [])

.directive('countrySelector', function ($document, $timeout, CountryCodes) {
    return {
        scope: {
            ngModel: '=',
            onSelect: '&',
        },
        replace: true,
        require: '^ngModel',
        templateUrl: 'directives/templates/country-selector.tpl.html',
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.isOpen = false;
            scope.CountryCodes = CountryCodes;

            function onDocumentClick(e) {
                if (scope.isOpen && !element[0].contains(e.target)) {
                    scope.isOpen = false;
                }
                scope.$digest();
            }

            // See Click everywhere but here event http://stackoverflow.com/questions/12931369
            $document.on('click', onDocumentClick);

            scope.$on('$destroy', function () {
                $document.off('click', onDocumentClick);
            });

            scope.$watch('isOpen', function () {
                if (scope.isOpen) {
                    $(element).find('.searchbox input').focus();
                    var selectedTag = $(element).find('li.selected')[0];
                    if (selectedTag) {
                        scrollToSelected($(element.find('ul')[0]), $(selectedTag));
                    }
                }
            });

            scope.showDropDown = function () {
                scope.isOpen = true;
            };

            scope.chooseCountry = function (countryCode) {
                scope.selectedCountry = countryCode;
                scope.isOpen = false;
                scope.search = '';
                ngModelCtrl.$setViewValue(countryCode.isoCode);
                // http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-3-isolate-scope-and-function-parameters
                scope.onSelect()(countryCode.isoCode, countryCode.name);
            };
        }
    };

    function scrollToSelected($container, $selected) {
        $container.scrollTop(0);
        var selectedOffset = $selected.offset().top;
        var selectedHeight = $selected.outerHeight(false);
        var containerOffset = $container.offset().top;
        $container.scrollTop(selectedOffset - containerOffset - selectedHeight * 2);
    }
});
