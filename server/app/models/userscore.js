var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserScoreSchema = new Schema({
	creator : {type: Schema.Types.ObjectId, ref: 'User'},
    userScore : Number,
    userGuessSuccessCount : Number,
    userGuessFailCount  : Number,
	created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('UserScore', UserScoreSchema);
