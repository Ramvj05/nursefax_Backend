const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const ExamPoolModel = require("../../../model/exampool.model");

const router = express.Router();

router.post("/removed", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { examId, testId, type } = req.body;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("ADMIN") || user.roles.includes("MODIFY_EXAM")) {
      const exam = await ExamPoolModel.findOneAndUpdate(
        {
          deleted: false,
          type: "TEST",
          examId,
          testId,
        },
        { status: "REMOVED" },
        {
          new: true,
        }
      );
      const examLearn = await ExamPoolModel.findOneAndUpdate(
        {
          deleted: false,
          type: "LEARN",
          examId,
          testId,
        },
        { status: "REMOVED" },
        {
          new: true,
        }
      );

      console.log(exam);
      if (exam && examLearn) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: [exam, examLearn],
            message: "exam modified successfully",
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
            message: "exam Not Found",
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
          message: "You do not have access to modilfy exam",
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
