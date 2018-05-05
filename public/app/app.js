angular.module('userApp', ['appRoutes', 'userControllers', 'userServices','contactServices', 'ngAnimate', 'mainController', 'authServices', 'emailController', 'managementController','ContactManagementController','contactControllers'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
