// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('SpotifyApp', ['ui.router', 'SpotifyApp.controllers'])


    .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js

        $urlRouterProvider.otherwise('discover');

        $stateProvider
            .state('discover', {
                url: '/discover',
                templateUrl: 'templates/discover.html',
                controller: 'DiscoverCtrl'
            })

    })