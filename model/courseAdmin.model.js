const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseAdminSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  profileUri: {
    type: String,
  },
  mobile: {
    type: String,
  },
  location: {
    type: String,
  },
  education: {
    type: String,
  },
  speciality: {
    type: String,
  },
  areaofinterest: {
    type: String,
  },
  uploadcv: {
    type: String,
  },
  about: {
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
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Array,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: true,
  },
  mobileVerified: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
  },
  
  country: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  mcc: {
    type: String,
  },
  examAssigned: {
    type: Array,
    required: true,
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("CourseAdmin", courseAdminSchema);
