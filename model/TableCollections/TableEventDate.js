const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostEventDateSchema = new Schema({
  eventdate: {
    type: Date,
    required: true,
  },
  eventtime: {
    type: String,
    required: true,
  },
  eventid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  expiredOn: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  modifyOn: {
    type: Date,
  },
});

module.exports = mongoose.model("PostEventDate", PostEventDateSchema);
