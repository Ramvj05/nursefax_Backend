const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const TakeAssessmentModel = require("../../../model/course/take_assessment.model");
const assessmentQuestionsModel = require("../../../model/course/question.model");
const router = express.Router();

router.put("/add-question/:id", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;

  const payload = req.body;

  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("STUDENT")) {
      const userExam = await TakeAssessmentModel.findOne({
        deleted: false,
        _id: id,
      });
      const { questions } = userExam;

      let assessmentQuestionsCount = await assessmentQuestionsModel
        .find({
          courseId: { $all: payload.courseId },
          deleted: false,
        })
        .count();

      let newQuestion = [];

      for (let index = 0; index <= questions.length; index++) {
        console.log("index", index);
        if (
          !questions.filter((ele) => ele?.["_id"] === req?.body?.["_id"])
            .length > 0
        ) {
          newQuestion = [...questions, req.body];
          console.log(newQuestion);
        } else if (questions?.[index]?.["_id"] === req?.body?.["_id"]) {
          newQuestion = [
            ...questions.filter((ele) => ele?.["_id"] !== req?.body?.["_id"]),
            req?.body,
          ];
        }
      }

      const updatedTakeAssessment = await TakeAssessmentModel.findOneAndUpdate(
        {
          deleted: false,
          _id: id,
        },
        {
          questions: newQuestion,
          progress: (newQuestion?.length / assessmentQuestionsCount) * 100,
        },
        {
          new: true,
        }
      );

      if (updatedTakeAssessment) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: updatedTakeAssessment,
            message: "Exam update successfully",
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
            message: "No Exam Found",
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
          message: "You do not have access to modify Exam",
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
