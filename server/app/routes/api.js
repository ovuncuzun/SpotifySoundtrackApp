var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

var SpotifyWebApi = require("../src/spotify-web-api");

var User = require('../models/user');


function createToken(user){
    console.log('creating token');
	var token = jsonwebtoken.sign({    
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresIn: 1440
	});

	return token;
}

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
								soundTracksPlaylist = spotifyApi.randomizePlaylist(data.body.items);
								res.json(soundTracksPlaylist);
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
    
	api.post('/signup', function(req,res){
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);
		user.save(function(err){
			if(err){
				res.send(err);
				return;
			}

			res.json({
				success: true,
				message: 'User has been created!',
				token: token
			});
		});
	});

	api.get('/users', function(req, res){

		User.find({},  function(err, users){
			if(err){
				res.send(err);
				return;
			}
			res.json(users);
		});
	});

	
	api.post('/login', function(req, res){
        console.log("osbourne1")
        console.log(req.body.username)
		User.findOne({ 
			username: req.body.username
		}).select('name username password').exec(function(err,user){

			if(err) throw err;
			if(!user) {
				res.send({ message: "User doesnt exist"});
			} 
            else if(user) {
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.send({ message: "Invalid password"});

				} else{
					///// token
					var token = createToken(user);
					res.json({
						success: true,
						message: "Succesfuly login!", 
						token: token
					});
				}
			}

		});
	});

    // middleware token // like police man
	api.use(function(req,res,next){

		console.log("somebody just came to our app");
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		// check if token exist
		if (token){
			//verify
			jsonwebtoken.verify(token, secretKey, function(err, decoded){
				if(err) {
					res.status(403).send({ success: false, message: "Failed to authenticate user"});
				}else{
					req.decoded =  decoded;
					next();
				}
			});
		}else{
			res.status(403).send({ success: false, message: "No token provided"});
		}
	});


    // for angular
    api.get('/me', function(req,res){
        console.log("me is called");
        res.json(req.decoded);
    });
    

	return api;
}

