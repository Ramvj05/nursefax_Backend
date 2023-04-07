const express = require("express");
const mongoose = require("mongoose");
const NanoclassClass = require("../../../class/nanoclass.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const NanoClassModel = require("../../../model/nanoclass.model");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
	const { decodeToken, user } = req.headers.user;
	let body = new NanoclassClass(req.body).getModel();
	console.log(body);
	const uri = dbUri;
	await mongoose.connect(uri);

	body = {
		...body,
		createdBy: decodeToken.id,
	};

	console.log(body);

	try {
		if (
			user.roles.includes("CREATE_NANOCLASS") ||
			user.roles.includes("ADMIN")
		) {
			const newNanoClassModel = new NanoClassModel(body);
			const data = await newNanoClassModel.save();
			res
				.header({
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				})
				.status(200)
				.send({
					data: data,
					message: "nanoclass Created Successfully",
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
					message: "You do not have access to create nanoclass",
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
