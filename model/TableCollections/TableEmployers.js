const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employerSchema = new Schema({
  fullName: {
    type: String,
    // required: true,
  },
  userName: {
    type: String,
  },
  mobile: {
    type: String,
  },
  hospitalname: {
    type: String,
  },
  bussinessname: {
    type: String,
  },
  companycantact: {
    type: String,
  },
  website: {
    type: String,
  },
  gstregno: {
    type: String,
  },
  about: {
    type: String,
  },
  companyemail: {
    type: String,
    // required: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  email: {
    type: String,
    // required: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  mobileVerified: {
    type: Boolean,
    default: false,
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
  token: {
    type: String,
  },
  picture: {
    type: String,
  },
  Address: {
    type: String,
  },
  userType: {
    type: Number,
    required: true,
    min: 0,
    max: 4,
  },
  roles: [
    {
      type: String,
      required: true,
    },
  ],
  mcc: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
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
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("Employers", employerSchema);
