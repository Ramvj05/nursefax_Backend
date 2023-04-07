const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const UserModel = require("../../../model/user.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.get("/list", async function (req, res) {
	const { user } = req.headers.user;

	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("ADMIN") || user.roles.includes("LIST_USERS")) {
			const { page, pageSize } = req.query;

			let query = {
				deleted: false,
				userType: 2,
			};
			let presentUser;
			let totalElements = await UserModel.find(query, { password: 0 }).count();

			presentUser = await pagination(
				UserModel.find(query, { password: 0 }),
				page,
				pageSize
			);

			if (presentUser.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: presentUser,
						message: "Data listed successfully",
						statsCode: 200,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: presentUser.length,
							hasNextPage: page && pageSize ? pageSize * page < totalElements : false,
							hasPreviousPage: page ? page > 1 : false,
							totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
						},
						error: null,
					});
			} else {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: [],
						message: "No Users Found",
						statsCode: 200,
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
					message: "You dont have access to get users",
					statsCode: 401,
					error: null,
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
