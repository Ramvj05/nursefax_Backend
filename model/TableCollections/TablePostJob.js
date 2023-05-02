const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostJobSchema = new Schema({
  posttitle: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
  },
  postlable: {
    type: String,
  },
  employername: {
    type: String,
  },
  employmenttype: {
    type: String,
  },
  hospitalname: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
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
    // default: Date.now,
  },
  createdBy: {
    type: String,
  },
  modifyOn: {
    type: Date,
    // default: Date.now,
  },
});

module.exports = mongoose.model("PostJob", PostJobSchema);
