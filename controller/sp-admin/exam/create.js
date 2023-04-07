const express = require("express");
const mongoose = require("mongoose");
const TestClass = require("../../../class/test.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const TestModel = require("../../../model/test.model");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  let body = new TestClass(req.body).getModel();
  console.log(body);
  const uri = dbUri;
  await mongoose.connect(uri);

  const count = await TestModel.find({}).count();

  let exId;
  if (count < 10) {
    exId = `ExCID-00000${count + 1}`;
  } else if (count < 100) {
    exId = `ExCID-0000${count + 1}`;
  } else if (count < 1000) {
    exId = `ExCID-000${count + 1}`;
  } else if (count < 10000) {
    exId = `ExCID-00${count + 1}`;
  } else if (count < 100000) {
    exId = `ExCID-0${count + 1}`;
  } else {
    exId = `ExCID-${count + 1}`;
  }
  body = {
    ...body,
    exId,
    createdBy: decodeToken.id,
  };

  console.log(body);

  try {
    if (user.roles.includes("ADMIN")) {
      const newtestModel = new TestModel(body);
      const data = await newtestModel.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "Test Created Successfully",
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
          message: "You do not have access to create Test",
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
