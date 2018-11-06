angular.module('SpotifyApp.controllers', ['SpotifyApp.services', 'cgNotify'])

    .controller('DiscoverCtrl', function($scope, $timeout, SpotifySoundtracks, notify, Auth, $sce) {
        console.log("DiscoverCtrl is called")
        $scope.startGuessingClicked = false;
        Auth.getUser()
			.then(function(data){
                console.log("DiscoverCtrl Auth.getUser is called")
				$scope.user = data.data;
			})
        $scope.loggedIn = Auth.isLoggedIn();
    
        SpotifySoundtracks.init()
            .then(function(){
                $scope.currentSong = SpotifySoundtracks.queueGuess[0].track;
                $scope.getSoundTrackImages();
                //SpotifySoundtracks.playCurrentSong();
                
            })
        $scope.userScore = 0;
        $scope.userGuessSuccessCount = 0;
        $scope.userGuessFailCount = 0;
        if($scope.loggedIn){
            SpotifySoundtracks.getUserScore()
                .success(function(data){
                    console.log("DiscoverCtrl SpotifySoundtracks.getUserScore is called")
                    if (data.length > 0) {
                        $scope.userScore = data[0].userScore;
                        $scope.userGuessSuccessCount = data[0].userGuessSuccessCount;
                        $scope.userGuessFailCount = data[0].userGuessFailCount;
                    }
                });
        }
        $scope.startGuessing = function () {
            $scope.startGuessingClicked = true;
            console.log("DiscoverCtrl SpotifySoundtracks.init is called")
            $scope.currentSong = SpotifySoundtracks.queueGuess[0].track;
            $scope.getSoundTrackImages();
            console.log("$scope.currentSong.preview_url")
            console.log($scope.currentSong.preview_url)
            SpotifySoundtracks.playCurrentSong();
        }
    
        $scope.$on('$destroy', function(event) {
          SpotifySoundtracks.removeAudio();
        });
        

        $scope.getSoundTrackImages = function () {
            console.log("DiscoverCtrl getSoundTrackImages is called")
            var queueLength = SpotifySoundtracks.queueImages.length;

            $scope.soundTrackImage1 = "";
            $scope.soundTrackImage2 = "";
            $scope.soundTrackImage3 = "";
           
            do {
                var random1 = $scope.getRandomInt(0,queueLength - 1)
                $scope.soundTrackImage1 = SpotifySoundtracks.queueImages[random1].track.album.images[1].url;
                //console.log("$scope.soundTrackImage1 is called")
                //console.log($scope.soundTrackImage1)
            } while ($scope.soundTrackImage1 === $scope.currentSong.album.images[1].url);
            
       
            do {
                var random2 = $scope.getRandomInt(0,queueLength - 1)
                $scope.soundTrackImage2 = SpotifySoundtracks.queueImages[random2].track.album.images[1].url;
                //console.log("$scope.soundTrackImage2 is called")
                //console.log($scope.soundTrackImage2)
            } while ($scope.soundTrackImage2 === $scope.currentSong.album.images[1].url || $scope.soundTrackImage2 === $scope.soundTrackImage1 );
            
            do {
                var random3 = $scope.getRandomInt(0,queueLength - 1)
                $scope.soundTrackImage3 = SpotifySoundtracks.queueImages[random3].track.album.images[1].url;
                //console.log("$scope.soundTrackImage3 is called")
                //console.log($scope.soundTrackImage3)
            } while ($scope.soundTrackImage3 === $scope.currentSong.album.images[1].url || $scope.soundTrackImage3 === $scope.soundTrackImage1 || $scope.soundTrackImage3 === $scope.soundTrackImage2 );

            $scope.shuffledSoundTrackImages = $scope.shuffleSoundTrackImages();
        }

        $scope.shuffleSoundTrackImages = function () {
            $scope.soundTrackImagesArray = [
                $scope.currentSong.album.images[1].url,
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
            if (soundTrackImageURL === $scope.currentSong.album.images[1].url) {
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
            $scope.currentSong = SpotifySoundtracks.queueGuess[0].track;
            console.log("SpotifySoundtracks.queueGuess")
            console.log(SpotifySoundtracks.queueGuess)
            $scope.getSoundTrackImages();
            
            SpotifySoundtracks.playCurrentSong();

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

    .controller('LetterCtrl', function($scope, $interval, SpotifySoundtracks) {
        SpotifySoundtracks.haltAudio();
        $scope.letters = ['E', 'e', 'L', 'l', 'A', 'a', 'K', 'k', 'İ', 'i', 'N', 'n'];
        $scope.indexLetters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        function shuffleArray(a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        }   

        $scope.shuffledIndex = shuffleArray($scope.indexLetters);
        console.log($scope.shuffledIndex);

        $scope.indexTrack = 0;
        function getRandomLetter() {
        
            var index = $scope.shuffledIndex[$scope.indexTrack];
            $scope.randomLetter = $scope.letters[index];

            $scope.indexTrack++;

            if($scope.indexTrack == 12) {
                $scope.shuffledIndex = shuffleArray($scope.indexLetters);
                console.log($scope.shuffledIndex);
                $scope.indexTrack = 0;
            }
        }

        $interval(getRandomLetter, 2000);
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

//hello

    


