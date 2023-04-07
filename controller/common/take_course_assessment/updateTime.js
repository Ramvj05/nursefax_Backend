const express = require("express");
const mongooes = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();
const DoExamModel = require("../../../model/doExam.model");

router.get("/time/:id", authorizer, async (req, res) => {
	await mongooes.connect(dbUri);
	try {
		const { user } = req.headers.user;
		const { id } = req.params;
		const { time } = req.query;
		if (user.roles.includes("STUDENT")) {
			const data = await DoExamModel.findOneAndUpdate(
				{
					_id: id,
					deleted: false,
				},
				{ time },
				{ new: true }
			);
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(200)
				.send({
					data: data,
					message: "Status updated Successfully",
					statsCode: 200,
					error: null,
				});
		} else {
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(401)
				.send({
					data: null,
					message: "You do not have access ",
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
