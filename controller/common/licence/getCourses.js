const express = require("express");
const mongooes = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const courseModel = require("../../../model/course.model");
const router = express.Router();
const LicenseModel = require("../../../model/license.model");
const TestModel = require("../../../model/test.model");
const examTheorymodel = require("../../../model/exam_theory.model");
const trainingModel = require("../../../model/training.model");
const courseCategoryModel = require("../../../model/admin/course_category.model");

router.get("/get-courses", authorizer, async (req, res) => {
  await mongooes.connect(dbUri);
  try {
    const { user } = req.headers.user;
    if (user.userType === 3) {
      let testResult = await TestModel.find({ deleted: false });
      let courseResult = await courseModel.find({ deleted: false });
      let trainingResult = await trainingModel.find({ deleted: false });
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data: [...testResult, ...courseResult, ...trainingResult],
          message: "Data Found",
          error: null,
        });
    } else {
      const licenceData = await LicenseModel.find({
        studentId: user.id,
        deleted: false,
        active: true,
      });

      let mainData = [];

      for (let index = 0; index < licenceData.length; index++) {
        const element = licenceData[index];
        if (element?.type === "COURSE") {
          const test = await courseModel.findOne({
            _id: element?.courseId,
            live: true,
            deleted: false,
            active: true,
          });
          if (test) {
            mainData.push(test?._doc);
          }
        } else if (element?.type === "TRAINING") {
          const test = await trainingModel.findOne({
            _id: element?.courseId,
            live: true,
            deleted: false,
            active: true,
          });
          if (test) {
            mainData.push(test?._doc);
          }
        } else {
          const findingId = element?.courseId
            ? element?.courseId
            : element?.examId;
          console.log("findingId", findingId);
          const test = await TestModel.findOne({
            _id: findingId,
            live: true,
            deleted: false,
            active: true,
          });
          const theoryResult = await examTheorymodel
            .find({
              examId: { $all: [findingId] },
              deleted: false,
            })
            .count();
          console.log(test?._doc, theoryResult);
          if (test && theoryResult) {
            mainData.push({ ...test?._doc, theoryCount: theoryResult });
          } else if (test) {
            mainData.push({ ...test?._doc, theoryCount: 0 });
          }
        }
      }
      let newData = [];
      if (mainData) {
        for (let index = 0; index < mainData.length; index++) {
          const element = mainData[index];
          let categoryResult = await courseCategoryModel.findOne({
            _id: element?.category?.[0],
            deleted: false,
            active: true,
          });
          if (categoryResult) {
            newData = [
              ...newData,
              {
                ...element,
                category: categoryResult?._doc,
              },
            ];
          } else {
            newData = [
              ...newData,
              {
                ...element,
              },
            ];
          }
        }
      }

      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data: newData,
          message: "Data Found",
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
