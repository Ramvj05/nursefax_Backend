const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const trainingModel = require("../../../model/training.model");
const courseCategoryModel = require("../../../model/admin/course_category.model");

const router = express.Router();

router.get("/trainings", async function (req, res) {
  const uri = dbUri;
  // await mongoose.connect(uri);
  mongoose.connect(uri, {

    useNewUrlParser: true,
    
    useUnifiedTopology: true
    
    }).then(async r=>{

  try {
    let result = await trainingModel.find({ deleted: false, active: true });
    let newData = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      let categoryResult = await courseCategoryModel.findOne({
        _id: element?.category?.[0],
        deleted: false,
        active: true,
      });
      if (categoryResult) {
        newData = [
          ...newData,
          {
            ...element._doc,
            category: categoryResult?._doc,
          },
        ];
      } else {
        newData = [
          ...newData,
          {
            ...element._doc,
          },
        ];
      }
    }
    if (newData.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: newData,
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
}).catch(r=>console.log('connect error',r));

});

module.exports = router;
