const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const CourseAdmin = require("../../../model/courseAdmin.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.get("/list-course-admin", authorizer, async function (req, res) {
	const { decodeToken, user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("ADMIN")) {
			let query = {
				deleted: false,
				// createdBy: decodeToken.id,
			};

			let { page, pageSize } = req.query;

			let totalElements = await CourseAdmin.find(query, {
				password: 0,
			}).count();

			let presentUser = await pagination(
				CourseAdmin.find(query, { password: 0 }),
				page,
				pageSize
			);

			console.log(presentUser);

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
						error: null,
						pageable: {
							totalElements,
							page,
							pageSize,
							currentSize: presentUser.length,
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
					statsCode: 401,
					data: null,
					message: "You dont have access to get course admin",
					error: {
						message: "Access Denied",
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
