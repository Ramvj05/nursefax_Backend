const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const LearningListModel = require("../../../model/learninglist.model");
const TheoryCardModel = require("../../../model/theory.model");

const router = express.Router();

router.get("/get", authorizer, async function (req, res) {
	try {
		await mongoose.connect(dbUri);
		const { user } = req.headers.user;
		if (user.roles.includes("STUDENT")) {
			const learningList = await LearningListModel.findOne({
				studentId: user._id.toString(),
				deleted: false,
			});

			if (learningList) {
				const listData = await TheoryCardModel.find({
					$or: [...learningList?.list.map((ele) => ({ _id: ele }))],
				});
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						statsCode: 200,
						data: { ...learningList["_doc"], listData },
						message: "Learning List get successfully",
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
						statsCode: 404,
						data: null,
						message: "No Notes found",
						error: {
							message: "no data present",
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
					message: "You do not have access to get learning list",
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
