const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostJobSchema = new Schema({
  posttitle: {
    type: String,
    // required: true,
  },
  postId: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
  },
  section: [
    {
      type: Object,
    },
  ],
  questions: {
    type: Array,
  },
  minsalary: {
    type: String,
  },
  maxsalary: {
    type: String,
  },
  currency: {
    type: String,
  },
  postlable: {
    type: String,
  },
  employername: {
    type: String,
  },
  employmenttype: {
    type: mongoose.Schema.Types.ObjectId,
  },
  speciality: {
    type: String,
  },
  keyword: {
    type: Array,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  navlink: {
    type: String,
  },
  enabled: {
    type: Boolean,
  },
  uploadfile: {
    type: String,
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
  assignto: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  changedstatusBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  modifyOn: {
    type: Date,
  },
});

module.exports = mongoose.model("PostJob", PostJobSchema);
