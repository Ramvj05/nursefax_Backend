const mongoose = require("mongoose");
const express = require("express");
const examTheorymodel = require("../../../model/exam_theory.model");
const authorizer = require("../../../middleware/authorizer");
const { dbUri } = require("../../../endpoints/endpoints");
const pagination = require("../../../utils/pagination");
const router = express.Router();

router.post("/list", authorizer, async (req, res) => {
  try {
    const { user } = req.headers.user;
    console.log(user);
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
    if (
      user.roles.includes("LIST_THEORY") ||
      user.roles.includes("STUDENT") ||
      user.roles.includes("ADMIN")
    ) {
      let data = {};
      data = await pagination(
        examTheorymodel.find({
          deleted: false,
          ...query,
        }),
        page,
        pageSize
      );

      if (data && Array.isArray(data) && data.length > 0) {
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
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(401)
        .send({
          data: null,
          message: "You do not have access to create Theory",
          statsCode: 401,
          error: {
            message: "Access denied",
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
