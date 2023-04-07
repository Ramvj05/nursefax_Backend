const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Licence = new Schema({
  paymentDetails: {
    type: Object,
  },
  paymentMethod: {
    type: Object,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  paidAmount: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
  },
  coursePrice: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
  },
  courseId: {
    type: String,
    required: true,
  },
  courseType: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("transactions", Licence);
