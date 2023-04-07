const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const SubClassModel = require("../../../model/subclass.model");
const SubClassClass = require("../../../class/subclass.class");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

router.put("/update/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;

	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		console.log(id);
		if (
			user.roles.includes("MODIFY_SUBCLASS") ||
			user.roles.includes("ADMIN")
		) {
			const payload = new SubClassClass(req.body).getModel();

			console.log(payload);

			const updatedsubclass = await SubClassModel.findOneAndUpdate(
				{
					deleted: false,
					_id: id,
				},
				payload,
				{
					new: true,
				}
			);

			console.log(updatedsubclass);
			if (updatedsubclass) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: updatedsubclass,
						message: "subclass update successfully",
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
						message: "No subclass Found",
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
					message: "You do not have access to modify subclass",
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
