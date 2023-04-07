const mongoose = require("mongoose");
const express = require("express");
const subTheoryModel = require("../../../../model/sub_theory.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const pagination = require("../../../../utils/pagination");
const theoryModel = require("../../../../model/theory.model");
const router = express.Router();

router.post("/list", authorizer, async (req, res) => {
  try {
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
      subTheoryModel.find({
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
        const result = await theoryModel.findOne({
          deleted: false,
          _id: element?.theoryId?.[0],
        });
        newData = [
          ...newData,
          { ...element?._doc, theoryName: result?._doc?.title },
        ];
        // newData.push([{ ...element, theoryName: result?._doc?.title }]);
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
