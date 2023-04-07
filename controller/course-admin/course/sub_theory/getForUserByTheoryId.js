const mongoose = require("mongoose");
const express = require("express");
const subTheoryModel = require("../../../../model/sub_theory.model");
const theoryClassificationModel = require("../../../../model/classification/theory.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const theoryModel = require("../../../../model/theory.model");
const finishedSubtheoryModel = require("../../../../model/course/finished_subtheory.model");
const router = express.Router();

router.get("/get-by-theory-user/:id", authorizer, async (req, res) => {
  try {
    await mongoose.connect(dbUri);

    const { id } = req.params;

    // if (
    //   user.roles.includes("LIST_THEORY") ||
    //   user.roles.includes("ADMIN") ||
    //   user.roles.includes("STUDENT")
    // ) {
    let data = {};
    data = await subTheoryModel.find({
      theoryId: { $all: [id] },
      deleted: false,
    });

    const newData = [];

    if (data && Array.isArray(data) && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        const result = await theoryModel.findOne({
          deleted: false,
          _id: element?.theoryId?.[0],
        });

        const completedResult = await finishedSubtheoryModel.findOne({
          userId: userId,
          theoryId: element?.theoryId?.[0],
          subTheoryId: element?._id,
        });

        newData.push({
          ...element?._doc,
          theoryName: result?._doc?.title,
          completed: completedResult?._doc?.title,
        });
      }
    }

    if (newData && newData?.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: newData,
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
