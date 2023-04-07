const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const SubjectModel = require("../../../model/subject.model");

const router = express.Router();

router.get("/inactive/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("MODIFY_SUBJECT") || user.roles.includes("ADMIN")) {
			const subject = await SubjectModel.findOneAndUpdate(
				{
					deleted: false,
					_id: id,
				},
				{ active: false },
				{
					new: true,
				}
			);

			console.log(subject);
			if (subject) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: subject,
						message: "subject modified successfully",
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
						message: "subject Not Found",
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
					message: "You do not have access to modilfy subject",
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
