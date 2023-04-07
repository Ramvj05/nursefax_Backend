const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const TrainingModel = require("../../../model/training.model");

const router = express.Router();

router.get("/get/:id", async function (req, res) {
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    const test = await TrainingModel.findOne({
      deleted: false,
      _id: id,
    });

    console.log(test);
    if (test) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: test,
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
          message: "No training Found",
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
