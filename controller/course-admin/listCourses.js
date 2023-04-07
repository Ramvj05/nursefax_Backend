const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../endpoints/endpoints");
const authorizer = require("../../middleware/authorizer");
const courseModel = require("../../model/course.model");
const testModel = require("../../model/test.model");
const trainingModel = require("../../model/training.model");

const router = express.Router();

router.get("/courses/list", authorizer, async function (req, res) {
  const {
    user,
    user: { id: courseAdminId },
  } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);

  const payload = {
    courseAdmin: { $all: [courseAdminId] },
    deleted: false,
  };

  try {
    if (user.roles.includes("ADMIN") || user.roles.includes("LIST_EXAM")) {
      const coursesResult = await courseModel.find(payload);
      const trainingResult = await trainingModel.find(payload);
      const examResult = await testModel.find(payload);

      if (examResult && coursesResult && trainingResult) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: [...examResult, ...coursesResult, ...trainingResult],
            message: "Data listed successfully",
            statsCode: 200,
            error: null,
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
          message: "You do not have access to get question",
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
