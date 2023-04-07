const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionPoolSchema = new Schema({
  exam: [
    {
      type: String,
    },
  ],
  qbId: {
    type: String,
  },
  category: [
    {
      type: String,
      required: true,
    },
  ],
  showOnStudent: {
    type: Boolean,
  },
  duration: {
    type: Number,
  },
  type: {
    type: String,
  },
  marks: {
    type: Number,
  },
  categoryColor: {
    type: String,
  },
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
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
  thumbnail: {
    type: String,
  },
  live: {
    type: Boolean,
    required: true,
    default: true,
  },
  questions: [
    {
      type: String,
      required: true,
    },
  ],

  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("questionPool", questionPoolSchema);
