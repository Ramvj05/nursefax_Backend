const express = require("express");
const mongoose = require("mongoose");
const endpoints = require("../../../endpoints/endpoints");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const DoExamModel = require("../../../model/doExam.model");
const axios = require("axios");
const TestModel = require("../../../model/questionpool.model");

const giveMeAnswer = require("../../../utils/giveMeAnswer");

const router = express.Router();

router.get("/result/:id", authorizer, async function (req, res) {
	const { user, authorization } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);
	try {
		if (user.roles.includes("STUDENT")) {
			const exam = await DoExamModel.findOne({
				deleted: false,
				_id: id,
			});
			const data = await axios.post(
				endpoints.quesionPool.getAll,
				{ testId: exam.testId, showAnswer: false },
				{
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						Authorization: authorization,
					},
				}
			);

			function sortingArray(arr) {
				return arr.sort((a, b) => {
					let newA = a?.["qId"].toUpperCase();
					let newB = b?.["qId"].toUpperCase();
					if (newA < newB) {
						return -1;
					}
					if (newA > newB) {
						return 1;
					}
					return 0;
				});
			}

			if (exam) {
				const { questions: dataQ, testId } = exam;
				const test = await TestModel.findById(testId);
				let questions = sortingArray(dataQ);
				let total = sortingArray(data?.data?.data?.questionsDb);
				console.log("questions.length", questions.length);
				if (questions.length === total.length) {
					let result = giveMeAnswer(questions, total, exam);

					console.log(result);
					let resultData = await DoExamModel.findByIdAndUpdate(
						{
							deleted: false,
							_id: id,
						},
						{
							result,
						},
						{
							new: true,
						}
					);
					res
						.header({
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						})
						.status(200)
						.send({
							data: { ...resultData.result, test },
							message: "exam found successfully",
							statsCode: 200,
							error: null,
						});
				} else {
					res
						.header({
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						})
						.status(400)
						.send({
							data: null,
							message: "Make sure you check the correct exam",
							statsCode: 400,
							error: null,
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
						message: "No exam Found",
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
