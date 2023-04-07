const mongooes = require("mongoose");

const Schema = mongooes.Schema;

const List = new Schema({
	studentId: { type: String },
	deleted: { type: Boolean, default: false },
	list: [{ type: String }],
	createdOn: { type: Date, default: new Date() },
});

module.exports = mongooes.model("LearningList", List);
