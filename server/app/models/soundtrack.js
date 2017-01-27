var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SoundTrackSchema = new Schema({
	creator : {type: Schema.Types.ObjectId, ref: 'User'},
    soundTrackID : String,
	soundTrackGuess: Boolean,
    soundTrackName : String,
    soundTrackMovie : String,
    soundTrackImage : String,
    soundTrackPreviewURL : String, 
	created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('SoundTrack', SoundTrackSchema);
