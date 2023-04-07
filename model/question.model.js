const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema({
	question: {
		type: String,
		required: true,
	},
	qId: {
		type: String,
	},
	examId:[
		{type:String}
	],
	testId:[
		{type:String}
	],
	subject: [
		{
			type: String,
		},
	],
	subClass: [
		{
			type: String,
		},
	],
	microClass: [
		{
			type: String,
		},
	],
	nanoClass: [
		{
			type: String,
		},
	],
	typeOfQuestion: {
		type: String,
		required: true,
	},
	comment: {
		type: String,
	},
	correctAnswer: [
		{
			title: {
				type: String,
				required: true,
			},
			value: {
				type: String,
				required: true,
			},
			src: {
				type: String,
			},
		},
	],
	createdOn: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: String,
	},
	status: {
		type: String,
	},
	options: [
		{
			title: {
				type: String,
				required: true,
			},
			value: {
				type: String,
				required: true,
			},
			src: {
				type: String,
			},
		},
	],
	keywords: [{ type: String }],
	deleted: {
		type: Boolean,
		default: false,
	},
	chooseAnswer:{
		type:Object,
		default:{}
	},
	lastAttemptOn:{
		type:String
	},
	action:{
		type:String
	},
	active: {
		type: Boolean,
		default: true,
	},
	explanation: {
		type: String,
	},
});

module.exports = mongoose.model("Question", questionSchema);
