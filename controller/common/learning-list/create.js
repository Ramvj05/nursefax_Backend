const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const LearningListModel = require("../../../model/learninglist.model");

const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
	try {
		await mongoose.connect(dbUri);
		const { decodeToken, user } = req.headers.user;
		let body = req?.body;
		body = { ...body, studentId: decodeToken.id };

		console.log("body", body);
		if (user.roles.includes("STUDENT")) {
			const userLearningList = await LearningListModel.findOne({
				deleted: false,
				studentId: user._id.toString(),
			});
			if (!userLearningList) {
				let data;

				const learningList = new LearningListModel(body);
				data = await learningList.save();
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						statsCode: 200,
						data: data,
						message: "Learning list created successfully",
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
						message: "You cannot create more than one learning list",
						statsCode: 401,
						error: {
							message: "Access denied",
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
					message: "You do not have access to create learning list",
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
