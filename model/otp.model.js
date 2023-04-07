const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	expiredIn: {
		type: Number,
	},
	otp: {
		type: Number,
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	transactionID: { type: String },
});

module.exports = mongoose.model("OTP", otpSchema);
