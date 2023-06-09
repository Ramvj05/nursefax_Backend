const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const BlogsSchema = Schema({
  BlogTitle: {
    type: String,
    required: true,
  },
  TopStories: {
    type: Boolean,
  },
  HomePage: {
    type: Boolean,
  },

  BlogURL: {
    type: String,
  },
  PrimaryCategory: {
    type: mongoose.Schema.Types.ObjectId,
  },

  OtherCategory: {
    type: mongoose.Schema.Types.ObjectId,

  },
  ShortDescription: {
    type: String,
  },
  BlogImage: {
    type: String,
  },
  // PostAuthor:{
  //     type:String,

  // },
  Description: {
    type: String,
  },
  YouTubeURL: {
    type: String,
  },
  MetaTitle: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  user_type: {
    type: String,
  },
  MetaDescription: {
    type: String,
  },
  MetaKeyword: {
    type: String,
  },
  Status: {
    type: String,
    // default: true, 
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

module.exports = mongoose.model("Blogs", BlogsSchema);