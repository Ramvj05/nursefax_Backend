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
  coursePrice: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
  },
  examId: {
    type: String,
  },
  courseId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
  },
  type: {
    type: String,
    required: true,
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
  expiredOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
});

module.exports = mongoose.model("licence", Licence);
