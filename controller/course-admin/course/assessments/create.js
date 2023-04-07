const mongoose = require("mongoose");
const express = require("express");
const AssessmentClass = require("../../../../class/course/assessment.class");
const assessmentModel = require("../../../../model/course/assessment.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const router = express.Router();

router.post("/create", authorizer, async (req, res) => {
  try {
    const { decodeToken } = req.headers.user;
    let body = new AssessmentClass(req.body).getModel();

    await mongoose.connect(dbUri);

    const existAssessmnt = await assessmentModel.find({
      courseId: { $all: req.body.courseId },
    });

    if (existAssessmnt && existAssessmnt?.length === 0) {
      let count = await assessmentModel.find({ deleted: false }).count();

      let thid;
      if (count < 10) {
        thid = `CAID-00000${count + 1}`;
      } else if (count < 100) {
        thid = `CAID-0000${count + 1}`;
      } else if (count < 1000) {
        thid = `CAID-000${count + 1}`;
      } else if (count < 10000) {
        thid = `CAID-00${count + 1}`;
      } else if (count < 100000) {
        thid = `CAID-0${count + 1}`;
      } else {
        thid = `CAID-${count + 1}`;
      }
      body = {
        ...body,
        createdBy: decodeToken.id,
        assessmentId: thid,
      };

      // if (user.roles.includes("CREATE_THEORY") || user.roles.includes("ADMIN")) {
      const newTheoryModel = new assessmentModel(body);
      const data = await newTheoryModel.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "Course Assessment Created Successfully",
          statsCode: 200,
          error: null,
        });
      // } else {
      //   res
      //     .header({
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //     })
      //     .status(401)
      //     .send({
      //       data: null,
      //       message: "You do not have access to create Theory",
      //       statsCode: 401,
      //       error: {
      //         message: "Access denied",
      //       },
      //     });
      // }
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(401)
        .send({
          data: null,
          message: "Course Assessment Already Exist",
          statsCode: 401,
          error: null,
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
