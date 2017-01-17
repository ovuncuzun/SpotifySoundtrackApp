angular.module('SpotifyApp', ['ui.router', 'SpotifyApp.controllers'])

    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('discover');

        $stateProvider
            .state('discover', {
                url: '/discover',
                templateUrl: 'templates/discover.html',
                controller: 'DiscoverCtrl'
            })

    })