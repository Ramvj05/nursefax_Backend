const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;
require("dotenv").config();

const UserWishlistSchema = Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  Status: {
    type: Boolean,
    default: true,
  },
  createDt: {
    type: Date,
    default: Date.now(),
  },
  modifyDt: {
    type: Date,
    default: Date.now(),
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("UserWishlist", UserWishlistSchema);
