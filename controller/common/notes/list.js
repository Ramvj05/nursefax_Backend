const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const NotesModel = require("../../../model/kanban.model");

const router = express.Router();

router.post("/list", authorizer, async function (req, res) {
	await mongoose.connect(dbUri);
	const { user } = req.headers.user;
	let query = { studentId: user.id, deleted: false };
	if (req?.body && Object.keys(req.body).length > 0) {
		query = {
			...query,
			$and: Object.entries(req.body).map(([key, value]) => {
				if (key === "title") {
					return {
						[key]: { $regex: value, $options: "i" },
					};
				} else {
					return { [key]: value };
				}
			}),
		};
	}
	try {
		console.log(query);
		if (user.roles.includes("STUDENT")) {
			const notes = await NotesModel.find(query);
			console.log(notes);
			if (notes && notes.length > 0) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						statsCode: 200,
						data: notes,
						message: "Notes created get successfully",
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
