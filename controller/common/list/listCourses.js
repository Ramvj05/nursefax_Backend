const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const courseModel = require("../../../model/course.model");
const courseCategoryModel = require("../../../model/admin/course_category.model");
const ratingModel = require("../../../model/TableCollections/TableRatings");

const router = express.Router();

router.get("/courses", async function (req, res) {
  const uri = dbUri;
  // await mongoose.connect(uri);
  mongoose
    .connect(uri, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    })
    .then(async (r) => {
      try {
        let result = await courseModel.find({ deleted: false, active: true });
        let newData = [];
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          let categoryResult = await courseCategoryModel.findOne({
            _id: element?.category?.[0],
            deleted: false,
            active: true,
          });
          // console.log(element, "kkkkkkkkkkkkkkkkkkkkk");
          let RatingResult = await ratingModel.find({
            course_id: element._id,
            is_delete: false,
          });
          var sum = 0;
          RatingResult.map((items) => {
            const to_sum = parseFloat(items.ratings);
            sum += to_sum == "NaN" ? 0 : to_sum;
          });
          var toalstar = sum / RatingResult.length;
          var fixednumber = toalstar.toFixed(1);
          if (categoryResult) {
            newData = [
              ...newData,
              {
                ...element._doc,
                category: categoryResult?._doc,
                Ratings: fixednumber >= 0 ? fixednumber : "0",
              },
            ];
          } else {
            newData = [
              ...newData,
              {
                ...element._doc,
                Ratings: fixednumber >= 0 ? fixednumber : "0",
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
    })
    .catch((r) => console.log("connect error", r));
});

module.exports = router;
