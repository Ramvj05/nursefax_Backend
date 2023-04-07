const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MicroclassModel = require("../../../model/microclass.model");

const router = express.Router();

router.get("/active/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (
			user.roles.includes("MODIFY_MICROCLASS") ||
			user.roles.includes("ADMIN")
		) {
			const microclass = await MicroclassModel.findOneAndUpdate(
				{
					deleted: false,
					_id: id,
				},
				{ active: true },
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
