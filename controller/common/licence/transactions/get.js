const express = require("express");
const mongooes = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const router = express.Router();
const TransactionModel = require("../../../../model/transactions.model");
const courseModel = require("../../../../model/course.model");
const examModel = require("../../../../model/test.model");
const trainingModel = require("../../../../model/training.model");

router.get("/get/:id", authorizer, async (req, res) => {
  const { user } = req.headers.user;
  const { id } = req.params;
  await mongooes.connect(dbUri);
  if (user.roles.includes("ADMIN")) {
    try {
      const tData = await TransactionModel.findOne({
        _id: id,
      });
      let courseData;
      if (tData?.courseType === "COURSE") {
        courseData = await courseModel.findOne({
          _id: tData?.courseId,
          deleted: false,
        });
      } else if (tData?.courseType === "TRAINING") {
        courseData = await trainingModel.findOne({
          _id: tData?.courseId,
          deleted: false,
        });
      } else {
        const findingId = tData?.courseId ? tData?.courseId : tData?.examId;
        courseData = await examModel.findOne({
          _id: findingId,
          deleted: false,
        });
      }
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data: { ...tData?._doc, course: courseData },
          message: "Data Found",
          error: null,
        });
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
  } else {
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(404)
      .send({
        statsCode: 404,
        data: null,
        message: "Do not access to list licence details",
        error: { message: "Access denied." },
      });
  }
});

module.exports = router;
