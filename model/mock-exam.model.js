const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MockExamSchema = new Schema({
	mockId: { type: String },
	examId: { type: String },
	questionData: { type: Object },
	result: { type: Object },
	studentId: { type: String },
	status: { type: String },
	time: { type: String },
	timer: { type: String },
	finishedOn: { type: Date },
	createdOn: { type: Date, default: new Date() },
});

module.exports = mongoose.model("MockExam", MockExamSchema);
