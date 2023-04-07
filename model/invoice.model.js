const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Licence = new Schema({
  uri: {
    type: String,
    required: true,
  },
  deleted: {
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
});

module.exports = mongoose.model("licence", Licence);
