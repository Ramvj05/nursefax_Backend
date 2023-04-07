const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoExamModel = new Schema({
	categoryId: {
		type: String,
	},
	studentId: {
		type: String,
	},
	result: {
		type: Object,
	},
	type: {
		type: String,
	},
	status: {
		type: String,
	},
	time: {
		type: String,
	},
	examId: {
		type: String,
		required: true,
	},
	testId: {
		type: String,
		required: true,
	},
	questions: [
		{
			type: Object,
			required: true,
		},
	],
	deleted: {
		type: Boolean,
		default: false,
	},
	active: {
		type: Boolean,
		default: true,
	},
	isDone: {
		type: Boolean,
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: String,
	},
	progress: { type: Number, default: 0 },
	finishedOn: { type: Date },
});

module.exports = mongoose.model("do-exam", DoExamModel);
