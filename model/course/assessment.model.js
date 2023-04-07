const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const theorySchema = new Schema({
  courseId: [{ type: String }],
  assessmentId: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  passingPercentage: { type: Number, required: true },
  numberOfAttempts: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
  status: { type: String },
  live: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdOn: { type: Date, default: new Date() },
  createdBy: { type: String },
  updatedBy: { type: String },
});

module.exports = mongoose.model("course-assessments", theorySchema);
