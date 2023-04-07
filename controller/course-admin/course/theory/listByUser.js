const mongoose = require("mongoose");
const express = require("express");
const theoryModel = require("../../../../model/theory.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const pagination = require("../../../../utils/pagination");
const subTheoryModel = require("../../../../model/sub_theory.model");
const finishedSubtheoryModel = require("../../../../model/course/finished_subtheory.model");
const router = express.Router();

router.post("/list-user", authorizer, async (req, res) => {
  try {
    const { decodeToken } = req.headers.user;
    await mongoose.connect(dbUri);
    let query;
    Object.entries(req.body).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        query = { ...query, [key]: { $all: value } };
      } else {
        if (value && !Array.isArray(value)) {
          query = { ...query, [key]: value };
        }
      }
    });
    const { page, pageSize } = req.body;
    // if (
    //   user.roles.includes("LIST_THEORY") ||
    //   user.roles.includes("STUDENT") ||
    //   user.roles.includes("ADMIN")
    // ) {
    let data = {};
    data = await pagination(
      theoryModel.find({
        deleted: false,
        ...query,
      }),
      page,
      pageSize
    );

    let newData = [];

    if (data && Array.isArray(data) && data.length > 0) {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const subTData = await subTheoryModel.find({
          deleted: false,
          theoryId: { $all: [element?._id] },
        });
        let newTdata = [];
        let totalSubTheories = subTData?.length;
        let completedSubTheories = 0;
        let inCompleteSubTheories = 0;
        if (subTData && Array.isArray(subTData) && subTData.length > 0) {
          for (let index = 0; index < subTData.length; index++) {
            const subElement = subTData[index];
            const completedResult = await finishedSubtheoryModel.findOne({
              userId: decodeToken?.id,
              theoryId: subElement?.theoryId?.[0],
              subTheoryId: subElement?._id,
            });
            if (
              completedResult &&
              (completedResult?._doc?.isDone || completedResult?.isDone)
            ) {
              completedSubTheories = completedSubTheories + 1;
            } else {
              inCompleteSubTheories = inCompleteSubTheories + 1;
            }
            newTdata = [
              ...newTdata,
              {
                _id: subElement?._doc?._id,
                title: subElement?._doc?.title,
                completed: completedResult?._doc?.isDone,
              },
            ];
          }
        }
        newData = [
          ...newData,
          {
            ...element?._doc,
            completed_sub_theories_data: newTdata,
            total_sub_theories: totalSubTheories,
            completed_sub_theories: completedSubTheories,
            incomplete_sub_theories: inCompleteSubTheories,
          },
        ];
      }
    }

    if (newData && Array.isArray(newData) && newData.length > 0) {
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
        .status(200)
        .send({
          data: [],
          message: "Data not found",
          statsCode: 200,
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
