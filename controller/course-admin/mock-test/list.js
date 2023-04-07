const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MockTestModel = require("../../../model/mocktest.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.post("/list", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		let query = {
			deleted: false,
		};

		if (Object.keys(req?.body).length > 0) {
			query = {
				...query,
				$and: Object.entries(req.body).map(([key, value]) => ({
					[key]: value,
				})),
			};
		}

		if (
			user.roles.includes("LIST_EXAM") ||
			user.roles.includes("ADMIN") ||
			user.roles.includes("STUDENT")
		) {
			const { page, pageSize } = req.body;
			let mocktest;
			let totalElements = await MockTestModel.find(query).count();
			mocktest = await pagination(MockTestModel.find(query), page, pageSize);

			if (mocktest.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: mocktest,
						message: "Data listed successfully",
						statsCode: 200,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: mocktest.length,
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
						message: "No mocktest Found",
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
