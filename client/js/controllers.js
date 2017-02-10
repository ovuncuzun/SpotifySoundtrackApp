angular.module('SpotifyApp.controllers', ['SpotifyApp.services', 'cgNotify'])

    .controller('DiscoverCtrl', function($scope, $timeout, SpotifySoundtracks, notify, Auth) {
        
        Auth.getUser()
			.then(function(data){
				$scope.user = data.data;
			})
        $scope.loggedIn = Auth.isLoggedIn();
    
        SpotifySoundtracks.init()
            .then(function(){
                $scope.currentSong = SpotifySoundtracks.queue[0].track;
                $scope.getSoundTrackImages();
                return SpotifySoundtracks.playCurrentSong();

            })
            .then(function(){
                $scope.currentSong.loaded = true;
            });
        $scope.userScore = 0;
        $scope.userGuessSuccessCount = 0;
        $scope.userGuessFailCount = 0;
        if($scope.loggedIn){
            SpotifySoundtracks.getUserScore()
                .success(function(data){
                    if (data.length > 0) {
                        $scope.userScore = data[0].userScore;
                        $scope.userGuessSuccessCount = data[0].userGuessSuccessCount;
                        $scope.userGuessFailCount = data[0].userGuessFailCount;
                    }
                });
        }
        
    
        $scope.$on('$destroy', function(event) {
          SpotifySoundtracks.removeAudio();
        });
        

        $scope.getSoundTrackImages = function () {
            var queueLength = SpotifySoundtracks.queue.length;

            $scope.soundTrackImage1 = "";
            $scope.soundTrackImage2 = "";
            $scope.soundTrackImage3 = "";

            do {
                $scope.soundTrackImage1 = SpotifySoundtracks.queue[$scope.getRandomInt(0,queueLength)].track.album.images[0].url;
            } while ($scope.soundTrackImage1 === $scope.currentSong.album.images[0].url);

            do {
                $scope.soundTrackImage2 = SpotifySoundtracks.queue[$scope.getRandomInt(0,queueLength)].track.album.images[0].url;
            } while ($scope.soundTrackImage2 === $scope.currentSong.album.images[0].url || $scope.soundTrackImage2 === $scope.soundTrackImage1 );

            do {
                $scope.soundTrackImage3 = SpotifySoundtracks.queue[$scope.getRandomInt(0,queueLength)].track.album.images[0].url;
            } while ($scope.soundTrackImage3 === $scope.currentSong.album.images[0].url || $scope.soundTrackImage3 === $scope.soundTrackImage1 || $scope.soundTrackImage3 === $scope.soundTrackImage2 );

            $scope.shuffledSoundTrackImages = $scope.shuffleSoundTrackImages();
        }

        $scope.shuffleSoundTrackImages = function () {
            $scope.soundTrackImagesArray = [
                $scope.currentSong.album.images[0].url,
                $scope.soundTrackImage1,
                $scope.soundTrackImage2,
                $scope.soundTrackImage3
            ];

            var array = $scope.soundTrackImagesArray;
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (0 !== currentIndex) {

                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        $scope.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        $scope.checkSong = function (soundTrackImageURL) {
            if (soundTrackImageURL === $scope.currentSong.album.images[0].url) {
                $scope.userScore = $scope.userScore + 1
                $scope.userGuessSuccessCount = $scope.userGuessSuccessCount + 1
                notify({
                    message: "Well done!",
                    classes: "alert-success",
                    templateUrl: "",
                    position: "center",
                    duration: 800
                });
                if($scope.loggedIn) {
                    SpotifySoundtracks.addSoundTrack({
                        soundTrackGuess : true,
                        currentSong : $scope.currentSong,
                    });
                    SpotifySoundtracks.saveUserScore({
                        userName : $scope.user.username,
                        userScore : $scope.userScore,
                        userGuessSuccessCount : $scope.userGuessSuccessCount,
                        userGuessFailCount  : $scope.userGuessFailCount
                    });
                }
                
            } else {
                $scope.userGuessFailCount = $scope.userGuessFailCount + 1
                if ($scope.userScore > 0 && $scope.userGuessFailCount % 5 === 0) {
                    $scope.userScore = $scope.userScore - 1
                }
                notify({
                    message: "Oh snap!",
                    classes: "alert-danger",
                    templateUrl: "",
                    position: "center",
                    duration: 800
                });
                if($scope.loggedIn) {
                    SpotifySoundtracks.addSoundTrack({
                        soundTrackGuess : false,
                        currentSong : $scope.currentSong,
                    });
                    SpotifySoundtracks.saveUserScore({
                        userName : $scope.user.username,
                        userScore : $scope.userScore,
                        userGuessSuccessCount : $scope.userGuessSuccessCount,
                        userGuessFailCount  : $scope.userGuessFailCount
                    });
                }
            }

            SpotifySoundtracks.nextSong();
            $timeout(function() {
                $scope.currentSong = SpotifySoundtracks.queue[0].track;
                $scope.getSoundTrackImages();
                $scope.currentSong.loaded = false;

            }, 50);

            SpotifySoundtracks.playCurrentSong().then(function() {
                $scope.currentSong.loaded = true;
            });

        }
        
        $scope.getSoundTrackGuessList = function () {
            $scope.SoundTrackGuessList = SpotifySoundtracks.getSoundTrackGuesses();
        }

    })

    .controller('LeaderboardCtrl', function($scope, SpotifySoundtracks) {
        SpotifySoundtracks.haltAudio();
        SpotifySoundtracks.getAllUsers()
            .success(function(data){
                $scope.rowCollection = data;
            });
        
    
    })

    .controller('ProfileCtrl', function($scope, SpotifySoundtracks) {
        SpotifySoundtracks.haltAudio();
    })

    .controller('AdminCtrl', function($scope, SpotifySoundtracks) {
        SpotifySoundtracks.haltAudio();
    })


angular.module('mainCtrl', ['authService'])

.controller('MainController', function($rootScope, $scope, $state, Auth, SpotifySoundtracks){
	var vm = this;
	vm.loggedIn = Auth.isLoggedIn();
    console.log("MainController is called")
	$rootScope.$on('$stateChangeStart', function(){
        SpotifySoundtracks.haltAudio();
		vm.loggedIn = Auth.isLoggedIn();
		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
                SpotifySoundtracks.getSoundTrackGuesses()
                    .success(function(data){
                        $scope.rowCollection = data;
                    });
                $scope.userScore = 0;
                $scope.userGuessSuccessCount = 0;
                $scope.userGuessFailCount = 0;
                if(vm.loggedIn) {
                    SpotifySoundtracks.getUserScore()
                        .success(function(data){
                            if (data.length > 0) {
                                $scope.userScore = data[0].userScore;
                                $scope.userGuessSuccessCount = data[0].userGuessSuccessCount;
                                $scope.userGuessFailCount = data[0].userGuessFailCount;
                            }
                        });
                }
			})
            .catch(function(errorCallback) {
                vm.loggedIn = false
            })
	});
    
	vm.doLogin = function(){
		console.log("Trying to login");
        
		vm.processing = true;
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data){
				vm.processing = false;
                console.log("Auth.login success");
				Auth.getUser()
					.then(function(data){
						vm.user = data.data;
					})

				if(data.success) {
                    $state.go('discover');
                }
				else {
                    console.log("data.message");
					vm.error = data.message;
                }    
			});
	};

	vm.doLogout = function(){
		Auth.logout();
		$state.go('signup');
	};
})

angular.module('userCtrl',['userService'])
	
	.controller('userCreateController', function(User, $state, $window, SpotifySoundtracks){
        SpotifySoundtracks.haltAudio();
		var vm = this;
        vm.signupUser = function(){

            console.log("Trying to create user!");

            vm.message = '';
            User.create(vm.userData)
                .then(function(response){
                    vm.userData = {};
                    vm.message = response.data.message;

                    $window.localStorage.setItem('token', response.data.token);
                    $state.go('/');
                })
        }
});


    


