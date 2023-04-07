const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const SubClassModel = require("../../../model/subclass.model");
const MicroClassModel = require("../../../model/microclass.model");
const NanoClassModel = require("../../../model/nanoclass.model");
const QuesionModel = require("../../../model/question.model");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

router.delete("/delete/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (
			user.roles.includes("MODIFY_SUBCLASS") ||
			user.roles.includes("ADMIN")
		) {
			const microClassResources = await MicroClassModel.find({
				subClass: { $all: [id] },
			});
			const nanoClassResources = await NanoClassModel.find({
				subClass: { $all: [id] },
			});
			const questionResources = await QuesionModel.find({
				subClass: { $all: [id] },
			});

			let handler = [];

			if (microClassResources && microClassResources.length > 0) {
				handler = [
					...handler,
					{
						resources: microClassResources.map((ele) => ({
							name: ele.name,
							id: ele["_id"],
							type: "Micro Class",
						})),
					},
				];
			}
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
							"You cannot delete SubClass, it is bind with some resources, You need to unbind the resources first",
						handler,
						statsCode: 401,
						error: {
							message: "Access denied",
						},
					});
			} else {
				const subclass = await SubClassModel.findOneAndUpdate(
					{
						deleted: false,
						_id: id,
					},
					{ deleted: true },
					{
						new: true,
					}
				);

				console.log(subclass);
				if (subclass) {
					res
						.header({
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						})
						.status(200)
						.send({
							data: subclass,
							message: "subclass modified successfully",
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
							message: "subclass Not Found",
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
					message: "You do not have access to modilfy subclass",
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
