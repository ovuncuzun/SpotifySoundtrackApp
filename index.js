var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./server/config');
var mongoose = require('mongoose');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(config.database, function(err){
	if(err) {
        console.log(err);
    } else{
        console.log("Connect to database");
    }
});

app.use(require('prerender-node').set('prerenderToken', 'iiXVwbdwdTtKkPA5ALSj'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/client'));


var api  = require('./server/routes/api')(app, express, io);
app.use('/api', api);

app.get('*', function(req,res){
	res.sendFile(__dirname  + '/client/index.html');
})
 
http.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else{
		console.log("Listening on port " + config.port);
	}
});