const mongoose = require("mongoose");
const express = require("express");
const ExamTheoryClass = require("../../../class/exam_theory.class");
const examTheorymodel = require("../../../model/exam_theory.model");
const authorizer = require("../../../middleware/authorizer");
const { dbUri } = require("../../../endpoints/endpoints");
const router = express.Router();

router.post("/create", authorizer, async (req, res) => {
  try {
    const { decodeToken, user } = req.headers.user;
    let body = new ExamTheoryClass(req.body).getModel();

    await mongoose.connect(dbUri);

    let count = await examTheorymodel.find({ deleted: false }).count();

    let thid;
    if (count < 10) {
      thid = `THID-00000${count + 1}`;
    } else if (count < 100) {
      thid = `THID-0000${count + 1}`;
    } else if (count < 1000) {
      thid = `THID-000${count + 1}`;
    } else if (count < 10000) {
      thid = `THID-00${count + 1}`;
    } else if (count < 100000) {
      thid = `THID-0${count + 1}`;
    } else {
      thid = `THID-${count + 1}`;
    }
    body = {
      ...body,
      createdBy: decodeToken.id,
      theoryId: thid,
    };

    if (user.roles.includes("CREATE_THEORY") || user.roles.includes("ADMIN")) {
      const newTheoryModel = new examTheorymodel(body);
      const data = await newTheoryModel.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "Theory Created Successfully",
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
          message: "You do not have access to create Theory",
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
