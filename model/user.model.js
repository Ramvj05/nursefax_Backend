const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    // required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  mobile: {
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
  countryCode: {
    type: String,
  },
  mcc: {
    type: String,
  },
  token: {
    type: String,
  },
  UserCountry: {
    type: String
  },
  picture: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  userType: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  roles: [
    {
      type: String,
      required: true,
    },
  ],
  active: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model("User", userSchema);
