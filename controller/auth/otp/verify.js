const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const OtpSchema = require("../../../model/otp.model");
const router = express.Router();

router.post("/verify", async function (req, res) {
	try {
		const uri = dbUri;

		const { otp, email } = req.body;

		await mongoose.connect(uri);

		const presentOtp = await OtpSchema.findOne({
			$and: [
				{
					otp: otp,
				},
				{
					email: email,
				},
			],
		});

		console.warn(presentOtp);
		if (presentOtp && presentOtp.expiredIn < new Date().getTime()) {
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(200)
				.json({
					statsCode: 200,
					data: presentOtp.transactionID,
					error: null,
					message: "Otp validate successfully",
				});
		} else {
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(500)
				.json({
					statsCode: 500,
					data: null,
					error: { message: "Invalid otp" },
					message: "Invalid otp",
				});
		}
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
