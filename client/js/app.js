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

            .state('leaderboard', {
                url: '/leaderboard',
                templateUrl: 'templates/leaderboard.html',
                controller: 'TrainingCtrl'
            })
    
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            })
        
            .state('admin', {
                url: '/admin',
                templateUrl: 'templates/admin.html',
                controller: 'AdminCtrl'
            })


    })