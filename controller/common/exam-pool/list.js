const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const ExamPoolModel = require("../../../model/exampool.model");
const pagination = require("../../../utils/pagination");
const TestModel = require("../../../model/questionpool.model");
const DoExamModel = require("../../../model/doExam.model");

const router = express.Router();

router.post("/list", authorizer, async function (req, res) {
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
      user.roles.includes("ADMIN") ||
      user.roles.includes("LIST_EXAM") ||
      user.roles.includes("STUDENT")
    ) {
      query = { ...query, deleted: false };

      const { page, pageSize } = req.body;
      let exam;
      console.log(query, "iiiiiiiiiiiiiiiiiiiii");
      let totalElements = await ExamPoolModel.find(query).count();

      exam = await pagination(ExamPoolModel.find(query), page, pageSize);

      let testArray = [];

      for (let i = 0; i < exam.length; i++) {
        let d = await TestModel.findOne({
          deleted: false,
          _id: exam[i].testId,
        });
        // console.log("data---", d);
        // console.log("comp---", d.live, query.live);

        let result = await DoExamModel.find({
          deleted: false,
          examId: req?.body?.examId,
          testId: exam[i].testId,
          // type: "TEST",
          studentId: user.id,
        });

        if (query.hasOwnProperty("live")) {
          if (d?.live === query.live) {
            testArray = [
              ...testArray,
              { ...exam[i]?.["_doc"], test: d, result: result ? result : [] },
            ];
          }
        } else {
          testArray = [
            ...testArray,
            { ...exam[i]?.["_doc"], test: d, result: result ? result : [] },
          ];
        }
      }
      if (testArray.length > 0) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: testArray,
            message: "Data listed successfully",
            statsCode: 200,
            pageable: {
              totalElements,
              page,
              pageSize,
              currentSize: exam.length,
              hasNextPage:
                page && pageSize ? pageSize * page < totalElements : false,
              hasPreviousPage: page ? page > 1 : false,
              totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
            },
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
            message: "No exam Found",
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
