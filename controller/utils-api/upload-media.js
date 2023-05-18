const AWS = require("aws-sdk");
const express = require("express");
const authorizer = require("../../middleware/authorizer");
const router = express.Router();

router.post("/media", authorizer, async (req, res) => {
  try {
    const { base64, ext, mimeType, fileName, path } = req.body;
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

    const buffer = Buffer.from(base64, "base64");
    const detectedExt = ext;
    const detectedMime = mimeType;
    const key = `${fileName}.${detectedExt}`;
    let url = "";
    await s3
      .putObject({
        Body: buffer,
        Key: `${path}/${key}`,
        ContentType: detectedMime,
        Bucket: "nursefaxbucket",
        ACL: "public-read-write",
      })
      .promise();
    url = `https://nursefaxbucket.s3.ap-southeast-1.amazonaws.com/${path}/${key}`;
    res
      .status(200)
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .json({
        statusCode: 0,
        data: url,
        message: "Media uploaded Successfully",
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
