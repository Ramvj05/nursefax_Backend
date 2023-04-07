const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const CategoryModel = require("../../../model/category.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.get("/list", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (
			user.roles.includes("LIST_CATEGORY") ||
			user.roles.includes("ADMIN") ||
			user.roles.includes("STUDENT")
		) {
			let query = {
				deleted: false,
			};
			const { page, pageSize } = req.query;
			const totalElements = await CategoryModel.find(query).count();
			let category;

			console.log(page, pageSize);
			category = await pagination(CategoryModel.find(query), page, pageSize);

			if (category.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: category,
						message: "Data listed successfully",
						statsCode: 200,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: category.length,
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
						message: "No category Found",
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
					message: "You do not have access to get question",
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
