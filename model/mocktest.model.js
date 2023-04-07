const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mockTestSchema = new Schema({
	name: { type: String },
	description: { type: String },
	examId: { type: String },
	testId: { type: String },
	numberOfSections: {
		type: Number,
		required: true,
	},
	totalDuration: {
		type: String,
	},
	timeFormat: {
		type: String,
	},
	sections: [
		{
			heading: { type: String },
			test: [
				{
					testId: { type: String },
					test: { type: Object },
					questions: [{ type: String }],
					numberOfQuestion: { type: Number },
				},
			],
			totalQuestion: [{ type: String }],
		},
	],
	instruction: {
		type: String,
	},
	generalInstruction: {
		type: String,
	},
	active: {
		type: Boolean,
		default: true,
	},
	deleted: { type: Boolean, default: false },
	createdBy: { type: String },
	createdOn: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Mocktest", mockTestSchema);
