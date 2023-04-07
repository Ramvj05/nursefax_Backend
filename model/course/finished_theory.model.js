const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoExamModel = new Schema({
  userId: {
    type: String,
  },
  time: {
    type: String,
  },
  courseId: {
    type: String,
    required: true,
  },
  theoryId: {
    type: String,
    required: true,
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
  finishedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("course-finished-theories", DoExamModel);
