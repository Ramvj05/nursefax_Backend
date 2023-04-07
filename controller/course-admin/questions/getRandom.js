const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();
const QuestionPoolModel = require("../../../model/questionpool.model");
const randomShuffle = require("../../../utils/randomShuffle");

router.post("/count", authorizer, async (req, res) => {
	const { user } = req.headers.user;
	const { count, testId, showAnswer } = req.body;
	const uri = dbUri;
	await mongoose.connect(uri);
	try {
		if (
			user.roles.includes("LIST_QUESTIONS") ||
			user.roles.includes("STUDENT")
		) {
			let test;

			if (testId && showAnswer) {
				test = await QuestionPoolModel.findOne(
					{
						deleted: false,
						_id: testId,
					},
					{ correctAnswer: 0 }
				);
			} else if (testId && !showAnswer) {
				test = await QuestionPoolModel.findOne({
					deleted: false,
					_id: testId,
				});
			} else {
				test = await QuestionPoolModel.findOne({
					deleted: false,
				});
			}

			console.log(test);
			if (test.questions) {
				const actualCount = Math.ceil(
					(test.questions.length * parseInt(count)) / 100
				);
				console.log(actualCount, test.questions.length, parseInt(count));

				const suffleQuestion = randomShuffle(parseInt(count), test.questions);
				
				if(suffleQuestion.length === test.questions.length){
					res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: {
							count: suffleQuestion.length,
							questions: suffleQuestion,
						},
						message: "Question found successfully",
						statsCode: 200,
						error: null,
					});	
				}else{
					res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: {
							count: suffleQuestion.length,
							questions: suffleQuestion,
						},
						message: "You Reached max length of Question pool",
						statsCode: 200,
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
					message: "You do not have access to get question",
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
