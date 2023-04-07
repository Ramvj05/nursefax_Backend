const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const NanoClassModel = require("../../../model/nanoclass.model");
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
		if (user.roles.includes("LIST_NANOCLASS") || user.roles.includes("ADMIN")) {
			query = { ...query, deleted: false };
			const { page, pageSize } = req.body;
			let nanoClass;
			let totalElements = await NanoClassModel.find(query).count();

			nanoClass = await pagination(NanoClassModel.find(query), page, pageSize);

			console.log(nanoClass);
			if (nanoClass.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: nanoClass,
						message: "Data listed successfully",
						statsCode: 200,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: nanoClass.length,
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
						message: "No nanoClass Found",
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
