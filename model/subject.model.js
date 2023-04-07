const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	deleted: {
		type: Boolean,
		default: false,
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: String,
	},
});

module.exports = mongoose.model("Subject", subjectSchema);
