const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const modelSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  groups: { type: Array },
  thumbnail: {
    type: String,
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

module.exports = mongoose.model("community", modelSchema);
