const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const nanoClassSchema = new Schema({
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
	subject: [
		{
			type: String,
			required: true,
		},
	],
	subClass: [
		{
			type: String,
			required: true,
		},
	],
	microClass: [
		{
			type: String,
			required: true,
		},
	],
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

module.exports = mongoose.model("NanoClass", nanoClassSchema);
