const express = require("express");
const mongooes = require("mongoose");
const QuestionPoolClass = require("../../../class/questionPool.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const QuestionPoolModel = require("../../../model/questionpool.model");

const router = express.Router();

router.post("/create", authorizer, async (req, res) => {
	const { decodeToken, user } = req.headers.user;

	let body = new QuestionPoolClass(req.body).getModel();

	await mongooes.connect(dbUri);

	const count = await QuestionPoolModel.find({}).count();

	let qbId;
	if (count < 10) {
		qbId = `TCID-00000${count + 1}`;
	} else if (count < 100) {
		qbId = `TCID-0000${count + 1}`;
	} else if (count < 1000) {
		qbId = `TCID-000${count + 1}`;
	} else if (count < 10000) {
		qbId = `TCID-00${count + 1}`;
	} else if (count < 100000) {
		qbId = `TCID-0${count + 1}`;
	} else {
		qbId = `TCID-${count + 1}`;
	}

	body = {
		...body,
		qbId,
		createdBy: decodeToken.id,
	};

	try {
		if (user.roles.includes("CREATE_POOL") || user.roles.includes("ADMIN")) {
			const newQuestionPool = new QuestionPoolModel(body);
			const data = await newQuestionPool.save();
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(200)
				.send({
					data: data,
					message: " Question Pool Created Successfully",
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
					message: "You do not have access to create question pool",
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
