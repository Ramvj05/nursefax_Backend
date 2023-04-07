const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const theorySchema = new Schema({
  theoryId: { type: String },
  courseId: [{ type: String }],
  category: [
    {
      type: String,
      required: true,
    },
  ],
  thumbnail: {
    type: String,
  },
  deleted: { type: Boolean, default: false },
  description: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String },
  live: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdOn: { type: Date, default: new Date() },
  createdBy: { type: String },
});

module.exports = mongoose.model("course-theories", theorySchema);
