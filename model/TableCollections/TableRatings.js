const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RatingsSchema = new Schema({
  ratings: {
    type: String,
  },
  comments: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
  },

  status: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model("CourseRatings", RatingsSchema);
