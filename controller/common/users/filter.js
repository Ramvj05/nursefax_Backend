const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const UserModel = require("../../../model/user.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.post("/filter", authorizer, async function (req, res) {
	const { user } = req.headers.user;

	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		let query = {
			$and: [{ deleted: false }, { userType: 2 }],
		};

		if (req.body.keyword) {
			query = {
				...query,
				$or: [
					{
						firstName: req.body.keyword,
					},
					{
						lastName: req.body.keyword,
					},
					{
						email: req.body.keyword,
					},
					{
						mobile: req.body.keyword,
					},
				],
			};
		}
		if (user.roles.includes("LIST_USERS") || user.roles.includes("ADMIN")) {
			const totalElements = await UserModel.find(query).count();
			let dbUser;

			const { page, pageSize } = req.body;

			dbUser = await pagination(
				UserModel.find(query, { password: 0 }),
				page,
				pageSize
			);

			if (dbUser.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: dbUser,
						message: "Data listed successfully",
						statsCode: 200,
						error: null,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: dbUser.length,
							hasNextPage: page && pageSize ? pageSize * page < totalElements : false,
							hasPreviousPage: page ? page > 1 : false,
							totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
						},
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
						message: "No User Found",
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
					message: "You do not have access to get Uers",
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
