angular.module('SpotifyApp', ['ui.router', 'ui.bootstrap', 'SpotifyApp.controllers', 'mainCtrl', 'authService', 'userService', 'userCtrl'])

    .config(function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
    
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        $locationProvider.hashPrefix('!');
    
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('/', {
                url: '/',
                templateUrl: 'templates/home.html',
                controller: 'MainController',
            })
        
            .state('discover', {
                url: '/discover',
                templateUrl: 'templates/discover.html',
                controller: 'DiscoverCtrl'
            })
        
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'MainController',
            })

            .state('leaderboard', {
                url: '/leaderboard',
                templateUrl: 'templates/leaderboard.html',
                controller: 'LeaderboardCtrl'
            })
    
            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                controller: 'MainController'
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
        
            .state('logout', {
                url: '/admin',
                templateUrl: 'templates/admin.html',
                controller: 'AdminCtrl'
            })


    });

