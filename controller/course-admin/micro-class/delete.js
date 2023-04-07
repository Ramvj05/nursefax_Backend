const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MicroClassModel = require("../../../model/microclass.model");
const NanoClassModel = require("../../../model/nanoclass.model");
const QuesionModel = require("../../../model/question.model");

const router = express.Router();

router.delete("/delete/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (
			user.roles.includes("MODIFY_MICROCLASS") ||
			user.roles.includes("ADMIN")
		) {
			const nanoClassResources = await NanoClassModel.find({
				microClass: { $all: [id] },
			});
			const questionResources = await QuesionModel.find({
				mircoClass: { $all: [id] },
			});

			let handler = [];

			if (nanoClassResources && nanoClassResources.length > 0) {
				handler = [
					...handler,
					{
						resources: nanoClassResources.map((ele) => ({
							name: ele.name,
							id: ele["_id"],
							type: "Nano Class",
						})),
					},
				];
			}
			if (questionResources && questionResources.length > 0) {
				handler = [
					...handler,
					{
						resources: questionResources.map((ele) => ({
							name: ele.question,
							id: ele["_id"],
							type: "Question",
						})),
					},
				];
			}

			console.log(handler);
			if (handler && handler.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(401)
					.send({
						data: null,
						message:
							"You cannot delete Micro Class, it is bind with some resources, You need to unbind the resources first",
						handler,
						statsCode: 401,
						error: {
							message: "Access denied",
						},
					});
			} else {
				const microclass = await MicroClassModel.findOneAndUpdate(
					{
						deleted: false,
						_id: id,
					},
					{ deleted: true },
					{
						new: true,
					}
				);

				console.log(microclass);
				if (microclass) {
					res
						.header({
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						})
						.status(200)
						.send({
							data: microclass,
							message: "microclass modified successfully",
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
							message: "microclass Not Found",
							statsCode: 404,
							error: {
								message: "No data present",
							},
						});
				}
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
					message: "You do not have access to modilfy microclass",
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
