const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const PostModel = require("../../../../model/jobs/post.model");
const PostClass = require("../../../../class/job/post.class");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  let body = new PostClass(req.body).getModel();
  console.log(body);
  const uri = dbUri;
  // await mongoose.disconnect();
  await mongoose.connect(uri);

  const count = await PostModel.find({}).count();
  console.log(count);
  let postId;
  if (count < 10) {
    postId = `JBPID-00000${count + 1}`;
  } else if (count < 100) {
    postId = `JBPID-0000${count + 1}`;
  } else if (count < 1000) {
    postId = `JBPID-000${count + 1}`;
  } else if (count < 10000) {
    postId = `JBPID-00${count + 1}`;
  } else if (count < 100000) {
    postId = `JBPID-0${count + 1}`;
  } else {
    postId = `JBPID-${count + 1}`;
  }

  body = {
    ...body,
    postId,
    createdBy: decodeToken.id,
  };

  try {
    if (user.roles.includes("ADMIN")) {
      const newPostModel = new PostModel(body);
      const data = await newPostModel.save();
      // await mongoose.disconnect();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "category Created Successfully",
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
          message: "You do not have access to create category",
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
