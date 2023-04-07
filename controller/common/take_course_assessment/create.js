const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();

const TakeAssessmentModel = require("../../../model/course/take_assessment.model");

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);
  try {
    if (user.roles.includes("STUDENT")) {
      const exist = await TakeAssessmentModel.find({
        $and: [
          { courseId: req.body.courseId },
          { assessmentId: req.body.assessmentId },
          { isFinished: false },
        ],
      }).count();

      if (exist === 0) {
        const body = {
          ...req.body,
          userId: decodeToken.id,
          createdBy: decodeToken.id,
        };
        const doExam = new TakeAssessmentModel(body);
        await doExam.save();
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: doExam,
            message: "Take Assessment Created Successfully",
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
            message: "Your test already stared, resume it.",
            statsCode: 401,
            error: {
              message: "Already Exist",
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
          message: "You do not have access to take assessment.",
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
