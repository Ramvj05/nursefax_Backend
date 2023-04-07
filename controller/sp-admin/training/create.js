const express = require("express");
const mongoose = require("mongoose");
const TrainingClass = require("../../../class/training.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const TrainingModel = require("../../../model/training.model");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  let body = new TrainingClass(req.body).getModel();
  console.log(body);
  const uri = dbUri;
  await mongoose.connect(uri);

  const count = await TrainingModel.find({}).count();

  let trainingId;
  if (count < 10) {
    trainingId = `TRID-00000${count + 1}`;
  } else if (count < 100) {
    trainingId = `TRID-0000${count + 1}`;
  } else if (count < 1000) {
    trainingId = `TRID-000${count + 1}`;
  } else if (count < 10000) {
    trainingId = `TRID-00${count + 1}`;
  } else if (count < 100000) {
    trainingId = `TRID-0${count + 1}`;
  } else {
    trainingId = `TRID-${count + 1}`;
  }
  body = {
    ...body,
    trainingId,
    createdBy: decodeToken.id,
  };

  console.log(body);

  try {
    if (user.roles.includes("ADMIN")) {
      const newTrainingModel = new TrainingModel(body);
      const data = await newTrainingModel.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "training Created Successfully",
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
          message: "You do not have access to create training",
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
