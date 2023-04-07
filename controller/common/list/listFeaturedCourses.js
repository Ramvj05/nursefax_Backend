const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const TestModel = require("../../../model/test.model");
const courseModel = require("../../../model/course.model");
const trainingModel = require("../../../model/training.model");

const router = express.Router();

router.get("/featured-courses", async function (req, res) {
  const uri = dbUri;
  // await mongoose.connect(uri);
  mongoose.connect(uri, {

    useNewUrlParser: true,
    
    useUnifiedTopology: true
    
    }).then(async r=>{
  try {
    let examsResults = await TestModel.find({
      featured: true,
      deleted: false,
      active: true,
    });
    let courseResults = await courseModel.find({
      featured: true,
      deleted: false,
      active: true,
    });
    let trainingResults = await trainingModel.find({
      featured: true,
      deleted: false,
      active: true,
    });
    const newData = [...examsResults, ...courseResults, ...trainingResults];
    if (newData.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: newData,
          message: "Featured Courses listed successfully",
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
}).catch(r=>console.log('connect error',r));
});

module.exports = router;
