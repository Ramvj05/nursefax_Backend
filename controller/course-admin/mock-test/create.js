const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MockTestSchema = require("../../../model/mocktest.model");
const MockTestClass = require("../../../class/mocktest.class");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
	await mongoose.connect(dbUri);
	const { decodeToken, authorization, user } = req.headers.user;
	let body = new MockTestClass(req.body).getModel();

	body = { ...body, createdBy: decodeToken.id };

	console.log("body", body);
	try {
		if (user.roles.includes("STUDENT") || user.roles.includes("CREATE_EXAM")) {
			let data;

			const newMockTest = new MockTestSchema(body);
			data = await newMockTest.save();
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(200)
				.send({
					statsCode: 200,
					data: data,
					message: "Mock test created successfully",
					error: null,
				});
		} else {
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(401)
				.send({
					data: null,
					message: "You do not have access to get mockTest",
					statsCode: 401,
					error: {
						message: "Access denied",
					},
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
			.send({
				statsCode: 500,
				data: null,
				message: "Somthing went wrong",
				error: err,
			});
	}
});

module.exports = router;
