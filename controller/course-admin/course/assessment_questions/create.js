const express = require("express");
const mongoose = require("mongoose");
const QuestionClass = require("../../../../class/course/question.class");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const QuestionModel = require("../../../../model/course/question.model");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  let body = new QuestionClass(req.body).getModel();

  const uri = dbUri;
  await mongoose.connect(uri);

  const count = await QuestionModel.find({}).count();
  console.log(count);

  let qId;
  if (count < 10) {
    qId = `QID-00000${count + 1}`;
  } else if (count < 100) {
    qId = `QID-0000${count + 1}`;
  } else if (count < 1000) {
    qId = `QID-000${count + 1}`;
  } else if (count < 10000) {
    qId = `QID-00${count + 1}`;
  } else if (count < 100000) {
    qId = `QID-0${count + 1}`;
  } else {
    qId = `QID-${count + 1}`;
  }

  body = {
    ...body,
    qId,
    createdBy: decodeToken.id,
  };

  const newQuestionModel = new QuestionModel(body);

  try {
    if (user.roles.includes("CREATE_QUESTIONS")) {
      const data = await newQuestionModel.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "Question Created Successfully",
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
          message: "You do not have access to create question",
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
