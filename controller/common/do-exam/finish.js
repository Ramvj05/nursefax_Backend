const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const DoExamModel = require("../.././../model/doExam.model");
const TestModel = require("../../../model/questionpool.model");

const router = express.Router();

router.get("/finish/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;

	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("STUDENT")) {
			const userExam = await DoExamModel.findOne({ deleted: false, _id: id });

			if (userExam) {
				const { questions, testId } = userExam;
				console.log("testId", testId);
				let total = await TestModel.findOne({ _id: testId });

				if (questions.length === total?.questions?.length) {
					const result = await DoExamModel.findByIdAndUpdate(
						{
							deleted: false,
							_id: id,
						},
						{ isDone: true, finishedOn: new Date() }
					);

					console.log("Result", JSON.stringify(result, null, 2));
					res
						.header({
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						})
						.status(200)
						.send({
							data: null,
							message: "Congratulations, You completed the exam",
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
							message: "Make sure you attempt all exam",
							statsCode: 401,
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
					.status(404)
					.send({
						data: null,
						message: "No Exam Found",
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
					message: "You do not have access to modify Exam",
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
