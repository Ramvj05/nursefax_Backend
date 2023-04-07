const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const CourseAdminModel = require("../../../model/courseAdmin.model");

const router = express.Router();

router.post("/filter-course-admin", authorizer, async function (req, res) {
	const { decodeToken, user } = req.headers.user;
	const uri = dbUri;
	await mongoose.connect(uri);

	console.log(req.body);

	try {
		if (user.roles.includes("ADMIN")) {
			const courseAdmin = await CourseAdminModel.find(
				{
					deleted: false,
					// createdBy: decodeToken.id,
					$or: [
						{
							userName: req.body?.keyword,
						},
						{
							fullName: req.body?.keyword,
						},
						{
							email: req.body?.keyword,
						},
						{
							mobile: req.body.keyword,
						},
					],
					$and: [
						...Object.entries(req.body).map(([key, value]) => {
							if (key === "roles") {
								return { roles: { $all: req.body?.roles } };
							} else {
								return { [key]: value };
							}
						}),
					],
				},
				{ password: 0 }
			);

			console.log(courseAdmin);
			if (courseAdmin.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: courseAdmin,
						message: "Data listed successfully",
						statsCode: 200,
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
						message: "No Course Admin Found",
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
					message: "You do not have access to get course admin",
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
