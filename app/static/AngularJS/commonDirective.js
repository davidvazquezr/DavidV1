registrationModule.directive("repeatEnd", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
});
registrationModule.directive('calendar', function() {
    return {
        link: function(scope, el, attr, ngModel) {
            $.fn.datepicker.dates['es'] = {
                days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
                daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
                months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                today: "Hoy",
                clear: "Clear",
                format: "mm/dd/yyyy",
                titleFormat: "MM yyyy",
                /* Leverages same syntax as 'format' */
                weekStart: 0
            };
            $(el).datepicker({
                language: "es",
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                calendarWeeks: false,
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy'
            });
        }
    };
});
registrationModule.directive('calendarYear', function() {
    return {
        link: function(scope, el, attr, ngModel) {
            $(el).datepicker({
                language: "es",
                format: "yyyy",
                viewMode: "years",
                minViewMode: "years"
            });
        }
    };
});
registrationModule.directive('icheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue) {
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function() {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function() {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    };
});

registrationModule.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
registrationModule.directive('formulario', function() {
    return {
        link: function(scope, element, attr, ngModelCtrl) {
            var faIcon = {
                valid: 'fa fa-check-circle fa-lg text-success',
                invalid: 'fa fa-times-circle fa-lg',
                validating: 'fa fa-refresh'
            }

            $('.formulario').bootstrapValidator({
                container: 'popover',
                message: 'This value is not valid',
                excluded: [':disabled'],
                feedbackIcons: faIcon,
                fields: {
                    vacio: {
                        container: 'popover',
                        validators: {
                            notEmpty: {
                                message: 'Campo Requerido'
                            }
                        }
                    }
                }
            }).on('status.field.bv', function(e, data) {
                var $form = $(e.target),
                    validator = data.bv,
                    $tabPane = data.element.parents('.tab-pane'),
                    tabId = $tabPane.attr('id');

                if (tabId) {
                    var $icon = $('a[href="#' + tabId + '"][data-toggle="tab"]').parent().find('i');
                    // Add custom class to tab containing the field
                    if (data.status == validator.STATUS_INVALID) {
                        $icon.removeClass(faIcon.valid).addClass(faIcon.invalid);
                    } else if (data.status == validator.STATUS_VALID) {
                        var isValidTab = validator.isValidContainer($tabPane);
                        $icon.removeClass(faIcon.valid).addClass(isValidTab ? faIcon.valid : faIcon.invalid);
                    }
                }
            });
        }
    };
});