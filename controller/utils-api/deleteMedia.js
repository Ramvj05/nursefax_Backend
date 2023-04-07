const AWS = require("aws-sdk");
const express = require("express");
const authorizer = require("../../middleware/authorizer");
const router = express.Router();

router.post("/delete-media", authorizer, async (req, res) => {
	try {
		const { fileName, path } = req.body;
		var s3 = new AWS.S3({
			region: "ap-southeast-1",
			accessKeyId: "AKIAQAENDR4JWZ4MI7K3",
			secretAccessKey: "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",
		});
		var options = {
			Bucket: "nursefaxbucket",
			Key: path + fileName,
		};
		await s3.deleteObject(options).promise();

		res
			.status(200)
			.header({
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			})
			.json({
				statusCode: 0,
				data: null,
				message: "Media deleted Successfully",
			});
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.header({
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			})
			.json({
				statusCode: 500,
				data: err,
				message: "Internal Server Error",
			});
	}
});

module.exports = router;
