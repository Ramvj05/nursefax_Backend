const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const examSchema = new Schema({
  exId: {
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
  price: {
    type: String,
  },
  inr_price: {
    type: String,
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
    default: "EXAM",
  },
  live: {
    type: Boolean,
    required: true,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("exam", examSchema);
