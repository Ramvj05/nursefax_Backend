const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const TestModel = require("../../../model/test.model");
const courseModel = require("../../../model/course.model");
const trainingModel = require("../../../model/training.model");
const courseCategoryModel = require("../../../model/admin/course_category.model");

const router = express.Router();

router.get("/byCategory/:id", async function (req, res) {
  const uri = dbUri;
  const categoryId = req.params.id;
  await mongoose.connect(uri);

  try {
    let newData = [];
    let categoryResult = await courseCategoryModel.findOne({
      _id: categoryId,
      deleted: false,
      active: true,
    });
    let examsResults = await TestModel.find({
      category: { $all: [categoryId] },
      deleted: false,
      active: true,
    });
    let courseResults = await courseModel.find({
      category: { $all: [categoryId] },
      deleted: false,
      active: true,
    });
    let trainingResults = await trainingModel.find({
      category: { $all: [categoryId] },
      deleted: false,
      active: true,
    });
    let examsWithCategory = [];
    let coursesWithCategory = [];
    let trainingsWithCategory = [];
    for (let index = 0; index < examsResults.length; index++) {
      const element = examsResults[index];
      if (categoryResult) {
        examsWithCategory = [
          ...examsWithCategory,
          {
            ...element._doc,
            category: categoryResult?._doc,
          },
        ];
      } else {
        examsWithCategory = [
          ...examsWithCategory,
          {
            ...element._doc,
          },
        ];
      }
    }
    for (let index = 0; index < courseResults.length; index++) {
      const element = courseResults[index];
      if (categoryResult) {
        coursesWithCategory = [
          ...coursesWithCategory,
          {
            ...element._doc,
            category: categoryResult?._doc,
          },
        ];
      } else {
        coursesWithCategory = [
          ...coursesWithCategory,
          {
            ...element._doc,
          },
        ];
      }
    }
    for (let index = 0; index < trainingResults.length; index++) {
      const element = trainingResults[index];
      if (categoryResult) {
        trainingsWithCategory = [
          ...trainingsWithCategory,
          {
            ...element._doc,
            category: categoryResult?._doc,
          },
        ];
      } else {
        trainingsWithCategory = [
          ...trainingsWithCategory,
          {
            ...element._doc,
          },
        ];
      }
    }
    newData = [
      {
        courses: examsWithCategory,
      },
      {
        courses: coursesWithCategory,
      },
      {
        courses: trainingsWithCategory,
      },
    ];
    if (newData.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: { category: categoryResult, data: newData },
          message: "Courses listed successfully",
          statsCode: 200,
          error: null,
        });
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: [],
          message: "No test Found",
          statsCode: 200,
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
