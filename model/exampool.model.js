const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const examSchema = new Schema({
	examId: {
		type: String,
	},
	testId: {
		type: String,
	},
	status: {
		type: String,
	},

	type: {
		type: String,
	},
	active: {
		type: Boolean,
		default: true,
	},
	deleted: {
		type: Boolean,
		default: false,
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: String,
	},
});

module.exports = mongoose.model("exampool", examSchema);
