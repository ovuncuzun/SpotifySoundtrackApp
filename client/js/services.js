angular.module('SpotifyApp.services', [])

    .factory('SpotifySoundtracks', function($q, $http) {

        var o = {
            queue: []
        };

        // placeholder for the media player
        var media;

        o.init = function() {
            if (o.queue.length === 0) {
                // if there's nothing in the queue, fill it.
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
                // merge data into the queue
                o.queue = o.queue.concat(data);
            });
        }

        o.playCurrentSong = function() {
            var defer = $q.defer();

            // play the current song's preview
            while (o.queue[0].track.preview_url == null) {
                o.nextSong();
            }
            media = new Audio(o.queue[0].track.preview_url);

            // when song loaded, resolve the promise to let controller know.
            media.addEventListener("loadeddata", function() {
                defer.resolve();
            });

            media.play();

            return defer.promise;
        }

        o.nextSong = function() {
            // pop the index 0 off
            o.queue.shift();

            // end the song
            o.haltAudio();

            // low on the queue? lets fill it up
            if (o.queue.length <= 3) {
                o.getNextSongs();
            }
        }

        // used when switching to favorites tab
        o.haltAudio = function() {
            if (media) media.pause();
        }
        
        o.removeAudio = function() {
            o.queue = [];
        }
        
        

        return o;
    });


angular.module('authService', [])

    .factory('Auth', function($http, $q, AuthToken){

        var authFactory = {};

        authFactory.login =  function(username, password){
        console.log("authFactory.login");

            return $http.post('/api/login',{
                username : username,
                password : password
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
        console.log("isloggedIn");

            if(AuthToken.getToken()){
                return true;
            }else{
                return false;
            }

        }

        authFactory.getUser = function(){
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
