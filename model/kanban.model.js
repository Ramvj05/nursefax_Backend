const mongooes = require("mongoose");

const Schema = mongooes.Schema;

const Card = new Schema({
	studentId: { type: String },
	title: { type: String },
	notes: { type: String },
	deleted: { type: Boolean, default: false },
	pin: { type: Boolean, default: false },
	createdOn: { type: Date, default: new Date() },
});

module.exports = mongooes.model("Note", Card);
