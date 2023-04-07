const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const QuestionPoolModel = require("../../../model/questionpool.model");
const pagination = require("../../../utils/pagination");
const categoryModel = require("../../../model/category.model");

const router = express.Router();

router.post("/filter", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);
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

  try {
    if (
      user.roles.includes("LIST_POOL") ||
      user.roles.includes("ADMIN") ||
      user.roles.includes("STUDENT")
    ) {
      const { page, pageSize } = req.body;
      query = {
        ...query,
        deleted: false,
      };
      let questionPool;
      let totalElements = await QuestionPoolModel.find(query).count();

      questionPool = await pagination(
        QuestionPoolModel.find(query),
        page,
        pageSize
      );
      console.log(questionPool);

      let newQuestionPool = [];

      for (let i = 0; i < questionPool.length; i++) {
        let d = await categoryModel.findOne({
          deleted: false,
          _id: questionPool[i].category?.[0],
        });
        newQuestionPool.push({
          ...questionPool?.[i]?.["_doc"],
          categoryName: d.name,
        });
      }

      if (newQuestionPool.length > 0) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: newQuestionPool,
            pageable: {
              totalElements,
              page,
              pageSize,
              currentSize: newQuestionPool.length,
              hasNextPage:
                page && pageSize ? pageSize * page < totalElements : false,
              hasPreviousPage: page ? page > 1 : false,
              totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
            },
            message: "Data listed successfully",
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
            message: "No questionPool Found",
            statsCode: 200,
            error: {
              message: "No data present",
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
          message: "You do not have access to get question",
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
