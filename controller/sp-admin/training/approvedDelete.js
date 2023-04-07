const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const QuestionPoolModel = require("../../../model/questionpool.model");
const ExamModel = require("../../../model/test.model");

const router = express.Router();

router.post("/remove-pool", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("ADMIN")) {
			const { examId, poolId: id } = req.body;

			console.log(examId, id);

			const presentQP = await QuestionPoolModel.findOne({
				deleted: false,
				_id: id,
			});

			console.log(presentQP);

			const presentExam = await ExamModel.findOne({
				deleted: false,
				_id: examId,
			});

			console.log(presentExam);

			if (presentExam && presentQP) {
				const { test } = presentExam;
				const { exam } = presentQP;

				const examToBeupdated = await ExamModel.findOneAndUpdate(
					{
						deleted: false,
						_id: examId,
					},
					{ test: test.filter((ele) => ele !== id) },
					{
						new: true,
					}
				);

				const questionPool = await QuestionPoolModel.findOneAndUpdate(
					{
						deleted: false,
						_id: id,
					},
					{ exam: exam.filter((ele) => ele !== examId), status: "REMOVED" },
					{
						new: true,
					}
				);

				console.log(JSON.stringify(questionPool, null, 2));
				console.log(JSON.stringify(examToBeupdated, null, 2));

				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: { questionPool, exam: examToBeupdated },
						message: "questionPool modified successfully",
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
						message: "Make Sure that Test and Exam are present",
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
					message: "You do not have access to modilfy questionPool",
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
