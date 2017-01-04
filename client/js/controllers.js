angular.module('SpotifyApp.controllers', ['SpotifyApp.services'])
    /*
     Controller for the discover page
     */

    .controller('DiscoverCtrl', function($scope, $timeout, Recommendations) {
        // first we'll need to initialize the Rec service, get our first songs, etc
        Recommendations.init()
            .then(function(){
                $scope.currentSong = Recommendations.queue[0].track;
                $scope.getSoundTrackImages();
                console.log($scope.currentSong);
                return Recommendations.playCurrentSong();

            })
            .then(function(){
                // turn loading off
                $scope.currentSong.loaded = true;
            });

        $scope.checkSong = function () {
            Recommendations.nextSong();
            $scope.getSoundTrackImages();
            $timeout(function() {
                $scope.currentSong = Recommendations.queue[0].track;
                $scope.currentSong.loaded = false;

            }, 250);

            Recommendations.playCurrentSong().then(function() {
                $scope.currentSong.loaded = true;

            });

        }

        $scope.getSoundTrackImages = function () {
            var queueLength = Recommendations.queue.length;
            $scope.soundTrackImage1 = Recommendations.queue[$scope.getRandomInt(0,queueLength)].track.album.images[0].url;
            $scope.soundTrackImage2 = Recommendations.queue[$scope.getRandomInt(0,queueLength)].track.album.images[0].url;
            $scope.soundTrackImage3 = Recommendations.queue[$scope.getRandomInt(0,queueLength)].track.album.images[0].url;
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


        // fired when we favorite / skip a song.
        $scope.sendFeedback = function (bool) {

            // first, add to favorites if they favorited
            if (bool) User.addSongToFavorites($scope.currentSong);

            // set variable for the correct animation sequence
            $scope.currentSong.rated = bool;
            $scope.currentSong.hide = true;

            // prepare the next song
            Recommendations.nextSong();

            // update current song in scope, timeout to allow animation to complete
            $timeout(function() {
                $scope.currentSong = Recommendations.queue[0].track;
                $scope.currentSong.loaded = false;

            }, 250);

            Recommendations.playCurrentSong().then(function() {
                $scope.currentSong.loaded = true;

            });

        }


        // used for retrieving the next album image.
        // if there isn't an album image available next, return empty string.
        $scope.nextAlbumImg = function() {
            if (Recommendations.queue.length > 1) {
                return Recommendations.queue[1].track.album.images[1].url;
            }

            return '';
        }

    });


