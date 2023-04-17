const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogCategoriesSchema = new Schema({
  CategoryName: {
    type: String,
    // required: true,
  },
  FeaturedCategory: {
    type: Boolean,
  },

  CateURL: {
    type: String,
  },
  SEOTitle: {
    type: String,
  },

  SEODescription: {
    type: String,
  },
  Description: {
    type: String,
  },
  BlogCategoryImage: {
    type: String,
  },
  SEOKeyword: {
    type: String,
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

module.exports = mongoose.model("BlogCategories", BlogCategoriesSchema);