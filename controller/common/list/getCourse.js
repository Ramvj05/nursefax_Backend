const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const CourseModel = require("../../../model/course.model");

const router = express.Router();

router.get("/get/:id", async function (req, res) {
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    const test = await CourseModel.findOne({
      deleted: false,
      _id: id,
    });

    if (test) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: test,
          message: "course found successfully",
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
          message: "No test Found",
          statsCode: 404,
          error: {
            message: "No data present",
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
