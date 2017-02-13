angular.module('SpotifyApp.services', [])

    .factory('SpotifySoundtracks', function($q, $http) {

        var o = {
            queueGuess: [],
            queueImages: [],
            soundTrackGuessList : []
        };
    
        

        // placeholder for the media player
        var media;

        o.init = function() {
            if (o.queueGuess.length === 0) {
                // if there's nothing in the queueGuess, fill it.
                // this also means that this is the first call of init.
                return o.getNextSongs();

            } else {
                // otherwise, play the current song
                return o.playCurrentSong();
            }
        }

        o.getNextSongs = function() {
            return $http({
                method: 'GET',
                url: '/api/soundtracks'
            }).success(function(data){
                // merge data into the queueGuess
                o.queueGuess = o.queueGuess.concat(data);
                o.queueImages = [];
                o.queueImages =  o.queueImages.concat(data);
            });
        }

        o.playCurrentSong = function() {
            var defer = $q.defer();

            // play the current song's preview
            while (o.queueGuess[0].track.preview_url == null) {
                o.nextSong();
            }
            media = new Audio(o.queueGuess[0].track.preview_url);

            // when song loaded, resolve the promise to let controller know.
            media.addEventListener("loadeddata", function() {
                defer.resolve();
            });

            media.play();

            return defer.promise;
        }

        o.nextSong = function() {
            // pop the index 0 off
            o.queueGuess.shift();

            // end the song
            o.haltAudio();

            // low on the queue? lets fill it up
            if (o.queueGuess.length <= 3) {
                o.getNextSongs();
            }
        }

        // used when switching to favorites tab
        o.haltAudio = function() {
            if (media) media.pause();
        }
        
        o.removeAudio = function() {
            o.queueGuess = [];
            o.queueImages = [];
        }
        
        o.addSoundTrack = function(soundTrackData) {
            return $http({
                method: 'POST',
                url: '/api/soundtrack',
                data: JSON.stringify(soundTrackData), //from serialized data to JSON
                headers: {'Content-Type': 'application/json'}
            })
        }
        
        o.saveUserScore = function(userScoreData) {
            return $http({
                method: 'POST',
                url: '/api/userscore',
                data: JSON.stringify(userScoreData), //from serialized data to JSON
                headers: {'Content-Type': 'application/json'}
            })
        }
        
        o.getSoundTrackGuesses = function () {
            return $http({
                method: 'GET',
                url: '/api/getsoundtrackguesses'
            });
        }
        
        o.getUserScore = function () {
            return $http({
                method: 'GET',
                url: '/api/getuserscore'
            });
        }
        
        o.getAllUsers = function () {
            return $http({
                method: 'GET',
                url: '/api/getallusers'
            });
        }
        

        return o;
    });


angular.module('authService', [])

    .factory('Auth', function($http, $q, AuthToken){

        var authFactory = {};

        authFactory.login =  function(username, password){
        console.log("authFactory.login");

             return $http({
                method: 'POST',
                url: '/api/login',
                data: JSON.stringify({
                    username : username,
                    password : password
                }),
                headers: {'Content-Type': 'application/json'}
            })
            .success(function(data){
                AuthToken.setToken(data.token);
                return data;
            });
        }

        authFactory.logout = function(){
            AuthToken.setToken();
        }

        authFactory.isLoggedIn = function(){

            if(AuthToken.getToken()){
                console.log("isloggedIn is true");
                return true;
            }else{
                console.log("isloggedIn is false");
                return false;
            }

        }

        authFactory.getUser = function(){
            console.log("getUser is called");
            if(AuthToken.getToken()){
                return $http.get('/api/me');
            }else{
                return $q.reject({ message: "User has no token"});
            }
        }

        return authFactory;
    })

    .factory('AuthToken', function($window){

        var authTokenFactory = {};
        authTokenFactory.getToken = function(){
            return $window.localStorage.getItem('token');
        }

        authTokenFactory.setToken = function(token){
        console.log("setToken");

            if(token){
                $window.localStorage.setItem('token', token);

            }else{
                $window.localStorage.removeItem('token');
            }
        }
        return authTokenFactory;
    })

    .factory('AuthInterceptor', function($q, $location, AuthToken){

        var interceptFactory = {};

        interceptFactory.request = function(config){
            var token = AuthToken.getToken();

            if(token){
                config.headers['x-access-token'] = token;
            }

            return config;
        };

        interceptFactory.responseError = function(response){
            if(response.status == 404)
                $location.path('/login');

            return $q.reject(response);
        };

        return interceptFactory;
    })

    .config(function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
    });

angular.module('userService', [])

    .factory('User', function($http){

        var userFactory = {};
         
        
        userFactory.create = function(userData){
            return $http({
                method: 'POST',
                url: '/api/signup',
                data: JSON.stringify(userData), //from serialized data to JSON
                headers: {'Content-Type': 'application/json'}
            })
        }
        
         userFactory.all = function(userData){
            return $http({
                method: 'GET',
                url: '/api/users'
            })
        }

        return userFactory;
    })


