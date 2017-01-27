var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SoundTrackSchema = new Schema({
	creator : {type: Schema.Types.ObjectId, ref: 'User'},
	soundTrackGuess: Boolean,
	created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('SoundTrack', SoundTrackSchema);