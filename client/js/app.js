angular.module('SpotifyApp', ['ui.router', 'ui.bootstrap', 'SpotifyApp.controllers', 'mainCtrl', 'authService', 'userService', 'userCtrl'])

    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};

        $urlRouterProvider.otherwise('discover');

        $stateProvider
            .state('/', {
                url: '/discover',
                templateUrl: 'templates/discover.html',
                controller: 'DiscoverCtrl'
            })
        
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
        
            .state('login', {
                 url: '/login',
			     templateUrl: 'templates/login.html'
            })
        
            .state('signup',{
                url: '/signup',
                templateUrl: 'templates/signup.html'
            })


    });

