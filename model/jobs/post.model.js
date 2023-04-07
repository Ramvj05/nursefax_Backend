const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const advertiseScema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  sections: { type: Array },
  label: {
    type: String,
  },
  employerName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  minSalary: {
    type: String,
    required: true,
  },
  maxSalary: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  expireOn: {
    type: String,
  },
  postId: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("posts", advertiseScema);
