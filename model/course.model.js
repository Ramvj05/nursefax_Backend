const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseId: {
    type: String,
  },
  category: [
    {
      type: String,
    },
  ],
  courseAdmin: [
    {
      type: String,
    },
  ],
  thumbnail: {
    type: String,
  },
  phone: {
    type: String,
  },
  features: [
    {
      type: Object,
    },
  ],
  courseFeatures: [
    {
      type: Object,
    },
  ],
  whyTakeCourse: [
    {
      type: Object,
    },
  ],
  sections: [
    {
      type: Object,
    },
  ],
  keywords: [
    {
      type: String,
    },
  ],
  faqs: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  inr_price: {
    type: Number,
  },
  original_price: {
    type: Number,
  },
  original_inr_price: {
    type: Number,
  },
  featured: {
    type: Boolean,
  },
  priority: {
    type: Number,
  },
  seo: {
    type: String,
  },
  headings: [
    {
      type: String,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "COURSE",
  },
  wishlist: {
    type: Boolean,
    default: false,
  },
  live: {
    type: Boolean,
    required: true,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
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

module.exports = mongoose.model("course", courseSchema);
