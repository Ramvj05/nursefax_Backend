const express = require("express");
const mongoose = require("mongoose");
const { dbUri, question } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MockTestModel = require("../.././../model/mocktest.model");
const MockExamModel = require("../.././../model/mock-exam.model");
const router = express.Router();

router.put("/add-question/:id", authorizer, async function (req, res) {
	console.log("--------------------------------------------------------");
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		let payload = {};
		let d = {};
		if (user.roles.includes("STUDENT")) {
			const userMock = await MockTestModel.findOne({ _id: id, deleted: false });
			const { sections, examId } = userMock;
			const examMock = await MockExamModel.findOne({
				mockId: id,
				studentId: user.id,
				$nor: [{ status: "COMPLETED" }],
			});

			console.log("examMock", examMock);
			if (examMock) {
				console.log("Mock Test Present");
				const { questionData } = examMock;
				for (let index = 0; index < sections.length; index++) {
					const element = sections[index];
					console.log(element._id.toString(), req?.body.sectionId);
					if (
						element._id.toString() === req?.body.sectionId &&
						element.totalQuestion.includes(req.body.question.id)
					) {
						console.log(
							"Given section is present and question is also present"
						);
						let e = examMock["_doc"];
						let q = questionData;

						if (questionData.hasOwnProperty(req?.body.sectionId)) {
							console.log(
								"questionData.hasOwnProperty(req?.body.sectionId)",
								questionData.hasOwnProperty(req?.body.sectionId)
							);
							if (
								questionData[req?.body.sectionId]
									.map((ele) => ele.id)
									.includes(req.body.question.id)
							) {
								console.log("Question data has section id ");
								payload = {
									...e,
									mockId: id,
									timer: req?.body?.timer,
									examId,
									status: "ONGOING",
									questionData: {
										...q,
										[req?.body.sectionId]: [
											...questionData[req?.body.sectionId].filter(
												(ele) => ele.id !== req.body.question.id
											),
											req.body.question,
										],
									},
								};

								console.log(JSON.stringify(payload));
							} else {
								payload = {
									...e,
									mockId: id,
									examId,
									timer: req?.body?.timer,
									status: "ONGOING",
									questionData: {
										...q,
										[req?.body.sectionId]: [
											...questionData?.[req?.body.sectionId],
											req?.body.question,
										],
									},
								};
							}
						} else {
							payload = {
								...e,
								mockId: id,
								examId,
								timer: req?.body?.timer,
								status: "ONGOING",
								questionData: {
									...q,
									[req?.body.sectionId]: [req?.body.question],
								},
							};
						}
						delete payload["__v"];
						d = await MockExamModel.findOneAndUpdate(
							{ _id: examMock._id },
							{ ...payload, time: req?.body?.time },
							{
								new: true,
							}
						);
					}
				}
			} else {
				for (let index = 0; index < sections.length; index++) {
					const element = sections[index];

					if (
						element._id.toString() === req?.body.sectionId &&
						element.totalQuestion.includes(req.body.question.id)
					) {
						payload = {
							mockId: id,
							examId,
							studentId: user.id,
							status: "STARTED",
							timer: req?.body?.timer,
							questionData: { [req?.body.sectionId]: [req.body.question] },
						};
						const mockExamData = new MockExamModel(payload);
						d = await mockExamData.save();
						break;
					}
				}
			}

			console.log(d);
			if (d && Object.keys(d).length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: d,
						message: "Exam update successfully",
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
						message: "Chek the payload ",
						statsCode: 400,
						error: {
							message: "bad request",
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
