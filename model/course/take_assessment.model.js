const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoExamModel = new Schema({
  userId: {
    type: String,
  },
  result: {
    type: Object,
  },
  status: {
    type: String,
  },
  time: {
    type: String,
  },
  courseId: {
    type: String,
    required: true,
  },
  assessmentId: {
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
  isFinished: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("take-assessments", DoExamModel);
