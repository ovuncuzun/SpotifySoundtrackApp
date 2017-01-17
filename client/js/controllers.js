angular.module('SpotifyApp.controllers', ['SpotifyApp.services', 'cgNotify'])

    .controller('DiscoverCtrl', function($scope, $timeout, SpotifySoundtracks, notify) {
        SpotifySoundtracks.init()
            .then(function(){
                $scope.currentSong = SpotifySoundtracks.queue[0].track;
                $scope.getSoundTrackImages();
                console.log($scope.currentSong);
                return SpotifySoundtracks.playCurrentSong();

            })
            .then(function(){
                // turn loading off
                $scope.currentSong.loaded = true;
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
            console.log($scope.currentSong)
            if (soundTrackImageURL === $scope.currentSong.album.images[0].url) {
                notify({
                    message: "Well done!",
                    classes: "alert-success",
                    templateUrl: "",
                    position: "center",
                    duration: 800
                });
            } else {
                notify({
                    message: "Oh snap!",
                    classes: "alert-danger",
                    templateUrl: "",
                    position: "center",
                    duration: 800
                });
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

    });


