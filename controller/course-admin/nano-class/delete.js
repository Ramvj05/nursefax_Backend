const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const NanoclassClass = require("../../../model/nanoclass.model");
const QuesionModel = require("../../../model/question.model");

const router = express.Router();

router.delete("/delete/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (
			user.roles.includes("MODIFY_NANOCLASS") ||
			user.roles.includes("ADMIN")
		) {
			const questionResources = await QuesionModel.find({
				mircoClass: { $all: [id] },
			});

			let handler = [];
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
							"You cannot delete Nano Class, it is bind with some resources, You need to unbind the resources first",
						handler,
						statsCode: 401,
						error: {
							message: "Access denied",
						},
					});
			} else {
				const nanoclass = await NanoclassClass.findOneAndUpdate(
					{
						deleted: false,
						_id: id,
					},
					{ deleted: true },
					{
						new: true,
					}
				);

				console.log(nanoclass);
				if (nanoclass) {
					res
						.header({
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						})
						.status(200)
						.send({
							data: nanoclass,
							message: "nanoclass modified successfully",
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
							message: "nanoclass Not Found",
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
					message: "You do not have access to modilfy nanoclass",
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
