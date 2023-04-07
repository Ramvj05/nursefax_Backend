const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const NotesModel = require("../../../model/kanban.model");

const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
	try {
		await mongoose.connect(dbUri);
		const { decodeToken, user } = req.headers.user;
		let body = req?.body;
		body = { ...body, studentId: decodeToken.id };

		console.log("body", body);
		if (user.roles.includes("STUDENT")) {
			let data;

			const notes = new NotesModel(body);
			data = await notes.save();
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(200)
				.send({
					statsCode: 200,
					data: data,
					message: "Notes created successfully",
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
					message: "You do not have access to create notes",
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
