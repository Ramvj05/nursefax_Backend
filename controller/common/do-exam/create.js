const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();

const DoExamModel = require("../../../model/doExam.model");

router.post("/create", authorizer, async function (req, res) {
	const { decodeToken, user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);


	try {
		if (user.roles.includes("STUDENT")) {
			
					const body = {
                        ...req.body,
						studentId:decodeToken.id,
                        createdBy: decodeToken.id,
					};
					const doExam = new DoExamModel(body);
					await doExam.save();
				

				console.log("data ----> ", doExam);
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: doExam,
						message: "Exam Created Successfully",
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
					message: "You do not have access to create exam",
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
