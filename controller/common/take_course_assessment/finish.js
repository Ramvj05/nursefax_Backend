const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const TakeAssessmentModel = require("../../../model/course/take_assessment.model");
const AssessmentQueModel = require("../../../model/course/question.model");

const router = express.Router();

router.get("/finish/:id", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;

  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("STUDENT")) {
      const userExam = await TakeAssessmentModel.findOne({
        deleted: false,
        _id: id,
      });

      if (userExam) {
        const { questions, courseId } = userExam;
        let AssessmentQueCount = await AssessmentQueModel.find({
          courseId: { $all: [courseId] },
          deleted: false,
        }).count();

        if (questions.length === AssessmentQueCount) {
          const result = await TakeAssessmentModel.findByIdAndUpdate(
            {
              deleted: false,
              _id: id,
            },
            { isFinished: true, finishedOn: new Date() }
          );

          console.log("Result", JSON.stringify(result, null, 2));
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              data: null,
              message: "Congratulations, You completed the assessment",
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
              message: "Make sure you attempt all questions",
              statsCode: 401,
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
          .status(404)
          .send({
            data: null,
            message: "No started assessment Found",
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
          message: "You do not have access to take assessment",
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
