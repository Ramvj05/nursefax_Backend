const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const SubClassModel = require("../../../model/subclass.model");
const SubjectModel = require("../../../model/subject.model");

const router = express.Router();

router.get("/get/:id", authorizer, async function (req, res) {
	const { user } = req.headers.user;
	const { id } = req.params;
	const uri = dbUri;
	await mongoose.connect(uri);

	try {
		if (user.roles.includes("LIST_SUBCLASS") || user.roles.includes("ADMIN")) {
			const subclass = await SubClassModel.findOne({
				deleted: false,
				_id: id,
			});

			let subjectData = [];

			if (
				subclass?.subject.filter((ele) => ele).map((ele) => ({ _id: ele }))
					.length > 0
			) {
				subjectData = await SubjectModel.find({
					$or: [
						...subclass?.subject
							.filter((ele) => ele)
							.map((ele) => ({ _id: ele })),
					],
				});
			}

			console.log(subclass);
			if (subclass) {
				res
					.header({
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					})
					.status(200)
					.send({
						data: { ...subclass["_doc"], subjectData },
						message: "subclass found successfully",
						statsCode: 200,
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
						data: null,
						message: "No subclass Found",
						statsCode: 404,
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
					message: "You do not have access to get subclass",
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
