const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const theorySchema = new Schema({
  subTheoryId: { type: String },
  theoryId: [{ type: String }],
  typeOfDoc: { type: String },
  content: {
    url: { type: String },
    content: { type: String },
    description: { type: String },
    fileName: { type: String },
  },
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

module.exports = mongoose.model("course-sub-theories", theorySchema);
