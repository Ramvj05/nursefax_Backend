const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BannerTestimonialSchema = new Schema({
  banner: {
    type: String,
  },
  mobile_banner: {
    type: String,
  },
  testimonial: {
    type: String,
  },
  type: {
    type: String,
  },
  user_image: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },

  is_delete: {
    type: Boolean,
    default: false,
  },
  createDt: {
    type: Date,
  },
  modifyDt: {
    type: Date,
  },
});

module.exports = mongoose.model("BannerTestimonial", BannerTestimonialSchema);
