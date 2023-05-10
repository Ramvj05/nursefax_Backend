const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostEmployerTypeSchema = new Schema({
  employementtype: {
    type: String,
    required: true,
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
  },
  createdBy: {
    type: String,
  },
  modifyOn: {
    type: Date,
  },
});

module.exports = mongoose.model("PostEmployerType", PostEmployerTypeSchema);
