var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

var SpotifyWebApi = require("../src/spotify-web-api");

module.exports = function(app, express, io){

	var api = express.Router();


	api.get('/soundtracks', function(req,res){

		var spotifyApi = new SpotifyWebApi({
		  clientId : 'e022491cb39547abb964e73fb4a71bac',
		  clientSecret : '37f49f344745465cb9b240c831b6874d'
		});


		var artistId = '21s5fge6x3c5aqp3pi52o73zq';
		var playListId = '5Ah9bG2RvqnavKXgweyBEw';
		var options = 'limit=100&offset=0';


		// Retrieve an access token
		spotifyApi.clientCredentialsGrant()
		  .then(function(data) {
		    spotifyApi.setAccessToken(data.body['access_token'])
            console.log("access_token")
		    console.log(data.body['access_token'])

		    var promise = spotifyApi.getPlaylistTracks(artistId, playListId, options)
		    promise.then(function(data) {
		    	var totalTracks = data.body.total;
		    	var offsetCounter = 100;
		    	while(totalTracks >= offsetCounter) {
		    		var options2 = 'limit=100&offset=' + offsetCounter;
		    		var promise2 = spotifyApi.getPlaylistTracks(artistId, playListId, options2)
		    		promise2.then(function(data2) {
		    			data.body.items = data.body.items.concat(data2.body.items);
		    			if(totalTracks <= data.body.items.length) {
				    		res.json(data.body.items);
				    	}
		    		}, function(err) {
				        callback(err);
				    });
				    offsetCounter += 100;
		    	}
		    	
		    }, function(err) {
		        callback(err);
		    });
		}, function(err) {
		    console.log('Something went wrong..', err.message);
		});


		   
	});
    
	return api;
}