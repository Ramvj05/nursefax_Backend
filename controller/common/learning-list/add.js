const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const LearningListModel = require("../../../model/learninglist.model");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

router.get("/add/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;

	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("STUDENT")) {
			const userLearningList = await LearningListModel.findOne({
				deleted: false,
				studentId: user._id.toString(),
			});

			if (userLearningList) {
				const learninglist = await LearningListModel.findOneAndUpdate(
					{
						deleted: false,
						studentId: user._id.toString(),
					},
					{ list: [...new Set([...userLearningList.list, id])] },
					{
						new: true,
					}
				);

				if (learninglist) {
					res
						.header({
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						})
						.status(200)
						.send({
							data: learninglist,
							message: "Learning List deleted successfully",
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
							message: "No Notes Found",
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
					.status(404)
					.send({
						data: null,
						message: "No Notes Found",
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
					message: "You do not have access to modify Learning list",
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
