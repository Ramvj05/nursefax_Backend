const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const QuestionModel = require("../../../model/question.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.post("/list", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);
	let query = {
		deleted: false,
	};
	Object.entries(req.body).map(([key, value]) => {
		if (Array.isArray(value)) {
			if (value.length === 0) {
				query = { ...query, [key]: value };
			} else {
				query = { ...query, [key]: { $all: value } };
			}
		} else {
			if (value && !Array.isArray(value)) {
				query = { ...query, [key]: value };
			}
		}
	});

	// if (
	// 	(req.body?.subject && req.body?.subject.length > 0) ||
	// 	(req.body?.microClass && req.body?.microClass.length > 0) ||
	// 	(req.body?.nanoClass && req.body?.nanoClass.length > 0) ||
	// 	(req.body?.subClass && req.body?.subClass.length > 0)
	// ) {
	// 	query = {
	// 		...query,
	// 		$and: [
	// 			{ subject: { $all: req.body?.subject } },
	// 			{ microClass: { $all: req.body?.microClass } },
	// 			{ nanoClass: { $all: req.body?.nanoClass } },
	// 			{ subClass: { $all: req.body?.subClass } },
	// 		],
	// 	};
	// }

	console.log("query ---------> ", JSON.stringify(query, null, 2));

	try {
		if (user.roles.includes("LIST_QUESTIONS") || user.roles.includes("STUDENT")) {
			const { page, pageSize } = req.body;
			let totalElements = await QuestionModel.find(query).count();
			let questions;
			if (!user.roles.includes("STUDENT")) {
				questions = await pagination(
					QuestionModel.find(query),
					page,
					pageSize,
					"qId"
				);
			} else {
				questions = await pagination(
					QuestionModel.find(query, { correctAnswer: 0 }),
					page,
					pageSize,
					"qId"
				);
			}

			console.log("questions.length", questions.length);
			if (questions.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: questions,
						message: "Data listed successfully",
						statsCode: 200,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: questions.length,
							hasNextPage: page && pageSize ? pageSize * page < totalElements : false,
							hasPreviousPage: page ? page > 1 : false,
							totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
						},
						error: null,
					});
			} else {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: [],
						message: "No Questions Found",
						statsCode: 200,
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
