const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const QuestionModel = require("../../../model/question.model");
const SubjectModel = require("../../../model/subject.model");
const SubClassModel = require("../../../model/subcategory.model");
const MicroClassModel = require("../../../model/microclass.model");
const NanoClassModel = require("../../../model/nanoclass.model");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

router.get("/get-question/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("LIST_QUESTIONS")|| user.roles.includes("STUDENT")) {
			let question;
			if(!user.roles.includes("STUDENT")){
				question = await QuestionModel.findOne({
					deleted: false,
					_id: id,
				});
	
			}else{
				question = await QuestionModel.findOne({
					deleted: false,
					_id: id,
				},{correctAnswer :  0 });
	
			}
			console.log(question, id);

			let subjectData = [];
			let subClassData = [];
			let microClassData = [];
			let nanoClassData = [];
			if (
				question?.subject.filter((ele) => ele).map((ele) => ({ _id: ele }))
					.length > 0
			) {
				subjectData = await SubjectModel.find({
					$or: [
						...question?.subject
							.filter((ele) => ele)
							.map((ele) => ({ _id: ele })),
					],
				});
			}
			if (
				question?.subClass.filter((ele) => ele).map((ele) => ({ _id: ele }))
					.length > 0
			) {
				subClassData = await SubClassModel.find({
					$or: [
						...question?.subClass
							.filter((ele) => ele)
							.map((ele) => ({ _id: ele })),
					],
				});
			}
			if (
				question?.microClass.filter((ele) => ele).map((ele) => ({ _id: ele }))
					.length > 0
			) {
				microClassData = await MicroClassModel.find({
					$or: [
						...question?.microClass
							.filter((ele) => ele)
							.map((ele) => ({ _id: ele })),
					],
				});
			}
			if (
				question?.nanoClass.filter((ele) => ele).map((ele) => ({ _id: ele }))
					.length > 0
			) {
				nanoClassData = await NanoClassModel.find({
					$or: [
						...question?.nanoClass
							.filter((ele) => ele)
							.map((ele) => ({ _id: ele })),
					],
				});
			}
			if (question) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: {
							...question["_doc"],
							subjectData,
							subClassData,
							microClassData,
							nanoClassData,
						},
						message: "Question found successfully",
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
