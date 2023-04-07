const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const NotesModel = require("../../../model/kanban.model");

const router = express.Router();

router.get("/get/:id", authorizer, async function (req, res) {
	try {
		await mongoose.connect(dbUri);
		const { user } = req.headers.user;
		const { id } = req.params;
		if (user.roles.includes("STUDENT")) {
			const notes = await NotesModel.findById(id);

			if (notes) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						statsCode: 200,
						data: notes,
						message: "Notes listed get successfully",
						error: null,
					});
			} else {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(404)
					.send({
						statsCode: 404,
						data: null,
						message: "No Notes found",
						error: {
							message: "no data present",
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
