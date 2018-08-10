var registrationModule = angular.module("registrationModule", ["ngRoute", "LocalStorageModule", 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.pinning', 'ui.grid.edit'])
    .config(function($routeProvider, $locationProvider) {

        /*cheange the routes*/
        $routeProvider.when('/', {
            templateUrl: 'AngularJS/Templates/login.html',
            controller: 'loginController'
        });
         $routeProvider.when('/operador', {
            templateUrl: 'AngularJS/Templates/operador.html',
            controller: 'operadorController'
        });
        $routeProvider.when('/unidad', {
            templateUrl: 'AngularJS/Templates/unidad.html',
            controller: 'unidadController'
        });
         $routeProvider.when('/ruta', {
            templateUrl: 'AngularJS/Templates/ruta.html',
            controller: 'rutaController'
        });

        $routeProvider.when('/despacho', {
            templateUrl: 'AngularJS/Templates/despacho.html',
            controller: 'despachoController'
        });

        $routeProvider.otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

registrationModule.directive('resize', function($window) {
    return function(scope, element) {
        var w = angular.element($window);
        var changeHeight = function() { element.css('height', (w.height() - 20) + 'px'); };
        w.bind('resize', function() {
            changeHeight(); // when window size gets changed
        });
        changeHeight(); // when page loads
    };
});
registrationModule.run(function($rootScope) {
    $rootScope.var = "full";

})
