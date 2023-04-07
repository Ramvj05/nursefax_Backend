const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const UserModel = require("../../../model/user.model");

const router = express.Router();

router.get("/get-my-profile", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);
	console.log("user?.decodeToken?.id", user._id.toString());
	try {
		res
			.header({
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			})
			.status(200)
			.send({
				data: user,
				message: "User found successfully",
				statsCode: 200,
				error: null,
			});
	} catch (err) {
		console.log(err);
		res
			.header({
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			})
			.status(500)
			.send({
				statsCode: 500,
				data: null,
				message: "Somthing went wrong",
				error: err,
			});
	}
});

module.exports = router;
