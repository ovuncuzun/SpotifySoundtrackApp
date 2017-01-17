angular.module('SpotifyApp', ['ui.router', 'ui.bootstrap', 'SpotifyApp.controllers'])

    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('discover');

        $stateProvider
            .state('discover', {
                url: '/discover',
                templateUrl: 'templates/discover.html',
                controller: 'DiscoverCtrl'
            })
        
            .state('home', {
                url: '/discover'
            })

            .state('training', {
                url: '/training',
                templateUrl: 'templates/training.html',
            });


    })