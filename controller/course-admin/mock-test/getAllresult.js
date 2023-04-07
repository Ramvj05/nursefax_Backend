const express = require("express");
const mongooes = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();
const MockExamModel = require("../../../model/mock-exam.model");

router.get("/get-all-results", authorizer, async (req, res) => {
	await mongooes.connect(dbUri);
	try {
		const { user } = req.headers.user;
		if (user.roles.includes("STUDENT")) {
			const data = await MockExamModel.find({ studenId: user.id });
			if (data && data.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						statsCode: 500,
						data: data,
						message: "result listed successfully",
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
						statsCode: 200,
						data: [],
						message: "No Data Found",
						error: { message: "Not Found" },
					});
			}
		} else {
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(400)
				.send({
					statsCode: 400,
					data: null,
					message: "You dont have rights to access results",
					error: { message: "Access Denied" },
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
