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
          url: 'http://localhost:8080/api/soundtracks'
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

      return o;
    });
