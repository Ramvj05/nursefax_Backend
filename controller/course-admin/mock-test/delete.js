const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MockTestModel = require("../../../model/mocktest.model");
const QuestionPoolModel = require("../../../model/questionpool.model");
const ExamPoolModel = require("../../../model/exampool.model");

const router = express.Router();

router.delete("/delete/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("MODIFY_EXAM") || user.roles.includes("ADMIN")) {
			const mocktest = await MockTestModel.findOneAndUpdate(
				{
					deleted: false,
					_id: id,
				},
				{ deleted: true },
				{
					new: true,
				}
			);

			await QuestionPoolModel.findOneAndUpdate(
				{
					deleted: false,
					_id: mocktest.testId,
				},
				{ deleted: true },
				{
					new: true,
				}
			);

			await ExamPoolModel.findOneAndUpdate(
				{
					deleted: false,
					testId: mocktest.testId,
				},
				{ deleted: true },
				{
					new: true,
				}
			);

			console.log(mocktest);
			if (mocktest) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: mocktest,
						message: "mocktest modified successfully",
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
						message: "mocktest Not Found",
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
					message: "You do not have access to modilfy mocktest",
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
