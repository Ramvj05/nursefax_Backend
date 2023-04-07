const express = require("express");
const QuestionModel = require("../../../model/question.model");
const QuestionPoolModel = require("../../../model/questionpool.model");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

router.post("/get-all-questions", authorizer, async (req, res) => {
  const { user } = req.headers.user;
  const { testId, showAnswer } = req.body;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (
      user.roles.includes("LIST_POOL") ||
      user.roles.includes("ADMIN") ||
      user.roles.includes("STUDENT")
    ) {
      let questionPool = await QuestionPoolModel.findOne({
        deleted: false,
        _id: testId,
      });

      console.log(questionPool);
      if (questionPool) {
        let questionData;

        if (!showAnswer) {
          questionData = await QuestionModel.find({
            $or: [...questionPool.questions.map((ele) => ({ _id: ele }))],
          });
        } else {
          questionData = await QuestionModel.find(
            {
              $or: [...questionPool.questions.map((ele) => ({ _id: ele }))],
            },
            { correctAnswer: 0, explanation: 0 }
          );
        }

        console.log("questionData", questionData);
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: { ...questionPool["_doc"], questionsDb: questionData },
            message: "questionPool found successfully",
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
            message: "No questionPool Found",
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
          message: "You do not have access to get questionPool",
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
