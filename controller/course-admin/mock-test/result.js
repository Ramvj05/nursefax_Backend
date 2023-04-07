const express = require("express");
const mongoose = require("mongoose");
const endpoints = require("../../../endpoints/endpoints");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MockExamModel = require("../../../model/mock-exam.model");
const pagination = require("../../../utils/pagination");
const router = express.Router();

router.get("/result/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);
	try {
		if (user.roles.includes("STUDENT")) {
			const exam = await pagination(
				MockExamModel.find({
					examId: id,
					studentId: user.id,
				}),
				null,
				null,
				"finishedOn"
			);

			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(200)
				.send({
					data: exam ? exam : [],
					message: "Result found successfully",
					statsCode: 200,
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
					message: "You do not have access to get exam",
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
