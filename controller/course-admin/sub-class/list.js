const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const SubClassModel = require("../../../model/subclass.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.post("/list", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);

	let query;
	Object.entries(req.body).map(([key, value]) => {
		if (Array.isArray(value) && value.length > 0) {
			query = { ...query, [key]: { $all: value } };
		} else {
			if (value && !Array.isArray(value)) {
				query = { ...query, [key]: value };
			}
		}
	});
	try {
		if (user.roles.includes("LIST_SUBCLASS") || user.roles.includes("ADMIN")) {
			query = { ...query, deleted: false };
			let totalElements = await SubClassModel.find(query).count();
			const { page, pageSize } = req.body;

			let subclass = await pagination(SubClassModel.find(query), page, pageSize);

			console.log(subclass);
			if (subclass.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: subclass,
						message: "Data listed successfully",
						statsCode: 200,
						error: null,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: subclass.length,
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
						message: "No subclass Found",
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
