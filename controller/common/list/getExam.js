const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const TestModel = require("../../../model/test.model");
const CourseModel = require("../../../model/course.model");
const TrainingModel = require("../../../model/training.model");

const router = express.Router();

router.get("/get/:id", async function (req, res) {
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    const exam = await TestModel.findOne({
      deleted: false,
      _id: id,
    });

    if (exam) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: exam,
          message: "exam found successfully",
          statsCode: 200,
          error: null,
        });
    } else {
      const course = await CourseModel.findOne({
        deleted: false,
        _id: id,
      });

      if (course) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: course,
            message: "course found successfully",
            statsCode: 200,
            error: null,
          });
      } else {
        const training = await TrainingModel.findOne({
          deleted: false,
          _id: id,
        });
        if (training) {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              data: training,
              message: "training found successfully",
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
              message: "No data Found",
              statsCode: 404,
              error: {
                message: "No data present",
              },
            });
        }
      }
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
