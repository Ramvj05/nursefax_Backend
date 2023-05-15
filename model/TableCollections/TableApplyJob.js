const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ApplyJobSchema = new Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  changedstatusBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  singlequestion: [
    {
      type: Object,
    },
  ],
  expiredOn: {
    type: Date,
    // default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  uploadfile: {
    type: String,
  },
  status: {
    type: String,
    default: "Applied",
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
  createdOn: {
    type: Date,
    // default: Date.now,
  },

  modifyOn: {
    type: Date,
    // default: Date.now,
  },
});

module.exports = mongoose.model("ApplyJob", ApplyJobSchema);
