const express = require("express");
const mongooes = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();
const LicenseModel = require("../../../model/license.model");
const TestModel = require("../../../model/test.model");
const ExamPoolModel = require("../../../model/exampool.model");
const QuestionPoolModel = require("../../../model/questionpool.model");

router.get("/list", authorizer, async (req, res) => {
	await mongooes.connect(dbUri);
	try {
		const { user } = req.headers.user;
		const licenceData = await LicenseModel.find({
			studentId: user.id,
			deleted: false,
		});

		let mainData = [];
		let testData = [];
		for (let index = 0; index < licenceData.length; index++) {
			const element = licenceData[index];
			const test = await TestModel.findById(element.examId);
			console.log("TEST ----------->", test);

			const testPool = await ExamPoolModel.find({
				examId: element.examId,
				status: "APPROVED",
			});

			console.log("Testpool -------> ", testPool);

			let listId = testPool.map((ele) => ele.testId);
			console.log("List Id ------------> ", listId);

			let newQ = {
				$or: listId.map((ele) => ({
					_id: ele,
				})),
			};

			console.log("newq --------> ", newQ);

			const qb = await QuestionPoolModel.find(newQ);
			console.log("qb ------------> ", qb);
		}

		res
			.header({
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			})
			.status(200)
			.send({
				statsCode: 200,
				data: licenceData,
				message: "Data Found",
				error: null,
			});
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
