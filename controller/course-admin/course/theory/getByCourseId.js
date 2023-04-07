const mongoose = require("mongoose");
const express = require("express");
const theoryModel = require("../../../../model/theory.model");
const theoryClassificationModel = require("../../../../model/classification/theory.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const router = express.Router();

router.get("/get-by-course/:id", authorizer, async (req, res) => {
  try {
    await mongoose.connect(dbUri);

    const { id } = req.params;

    // if (
    //   user.roles.includes("LIST_THEORY") ||
    //   user.roles.includes("ADMIN") ||
    //   user.roles.includes("STUDENT")
    // ) {
    let data = {};
    data = await theoryModel.find({
      courseId: { $all: [id] },
      deleted: false,
    });
    const newData = [];
    if (data && Array.isArray(data) && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const result = await theoryClassificationModel.findOne({
          deleted: false,
          _id: element?.category?.[0],
        });
        newData.push({ ...element?._doc, categoryName: result?._doc?.title });
      }
    }

    if (newData) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "Theory listed sucessfully",
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
          message: "Data not found",
          statsCode: 404,
          error: {
            message: "Theory not found",
          },
        });
    }
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
