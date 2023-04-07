const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const QuestionModel = require("../../../model/question.model");
const QuestionClass = require("../../../class/question.class");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

router.post("/remove", authorizer, async function (req, res) {
	const { user } = req.headers.user;

	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("MODIFY_QUESTIONS")) {
			const data = req?.body?.data?.map(async (ele) => {
				if (ele.hasOwnProperty("examId")) {
					await QuestionModel.findOneAndUpdate(
						{
							deleted: false,
							_id: ele.id,
						},
						{ examId: [] },
						{
							new: true,
						}
					);
				} else if (ele.hasOwnProperty("testId")) {
					await QuestionModel.findOneAndUpdate(
						{
							deleted: false,
							_id: ele.id,
						},
						{ testId: [] },
						{
							new: true,
						}
					);
				}
			});

			if (data) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: null,
						message: "Question Added successfully",
						statsCode: 200,
						error: null,
					});
			} else {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(404)
					.send({
						data: null,
						message: "No Question Found",
						statsCode: 404,
						error: {
							message: "No data present",
						},
					});
			}
		} else {
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(401)
				.send({
					data: null,
					message: "You do not have access to modify question",
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
