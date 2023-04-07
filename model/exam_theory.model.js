const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const theorySchema = new Schema({
  theoryId: { type: String },
  examId: [{ type: String }],
  category: [
    {
      type: String,
    },
  ],
  subjectIds: [{ type: String }],
  subClassIds: [{ type: String }],
  microClassIds: [{ type: String }],
  nanoClassIds: [{ type: String }],
  typeOfDoc: { type: String },
  thumbnail: {
    type: String,
  },
  content: {
    url: { type: String },
    content: { type: String },
    description: { type: String },
    fileName: { type: String },
  },
  deleted: { type: Boolean, default: false },
  description: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String },
  createdOn: { type: Date, default: new Date() },
  createdBy: { type: String },
});

module.exports = mongoose.model("exam-theories", theorySchema);
