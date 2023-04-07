const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const UserModel = require("../../../model/user.model");

const router = express.Router();

router.put("/user/update/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("ADMIN")) {
			const dbUser = await UserModel.findOneAndUpdate(
				{
					deleted: false,
					_id: id,
					userType: 2,
				},
				{ ...req.body?.payload },
				{
					new: true,
				}
			);
			if (dbUser) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: dbUser,
						message: "user update successfully",
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
						message: "User Not Found",
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
					message: "You do not have access to modilfy User",
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
