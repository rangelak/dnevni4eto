const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a new schema
const StorySchema = new Schema({
	title:{
		type: String,
		required: true
	},
	details:{
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('stories', StorySchema);