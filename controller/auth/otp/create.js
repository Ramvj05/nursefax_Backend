const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const OtpSchema = require("../../../model/otp.model");
const otpGenerator = require("otp-generator");
const router = express.Router();

router.get("/create/:email", async function (req, res) {
	try {
		const uri = dbUri;

		await mongoose.connect(uri);

		const newOtp = new OtpSchema({
			email: req?.params?.email,
			expiredIn: new Date().getTime() + 60 * 10,
			otp: Math.floor(1000 + Math.random() * 9000),
		});

		let y = await newOtp.save();

		res
			.header({
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			})
			.status(200)
			.json({
				statsCode: 200,
				data: y,
				error: null,
				message: "Otp generated successfully",
			});
	} catch (err) {
		console.log(err);
		res
			.header({
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			})
			.status(500)
			.json({
				statsCode: 500,
				data: null,
				error: err,
				message: "Something went wrong",
			});
	}
});

module.exports = router;
