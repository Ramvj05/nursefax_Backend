const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostEventSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  eventId: {
    type: String,
    // required: true,
  },
  heading: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
  },
  uploadfile: {
    type: String,
  },

  navlink: {
    type: String,
  },
  seotitle: {
    type: String,
  },
  seodescription: {
    type: String,
  },
  seokeyword: {
    type: Array,
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
    type: String,
  },
  modifyOn: {
    type: Date,
  },
});

module.exports = mongoose.model("PostEvent", PostEventSchema);
