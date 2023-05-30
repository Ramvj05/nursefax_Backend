const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const DoExamModel = require("../../../model/doExam.model");
const pagination = require("../../../utils/pagination");
const TestModel = require("../../../model/questionpool.model");
const router = express.Router();

router.post("/filter", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    let query = {
      deleted: false,
    };

    if (Object.keys(req?.body).length > 0) {
      query = {
        ...query,
        $and: [
          ...Object.entries(req.body).map(([key, value]) => ({
            [key]: value,
          })),
          { studentId: user.id },
        ],
      };
    }

    if (
      user.roles.includes("LIST_EXAM") ||
      user.roles.includes("ADMIN") ||
      user.roles.includes("STUDENT")
    ) {
      const { page, pageSize, examId, userId, isDone } = req.body;
      let allExam = [];
      let exam;
      let inside = { examId: examId, userId: userId, isDone: isDone };
      console.log(inside, "mmmmmmmmmmmmmmmmmmmm");
      let totalElements = await DoExamModel.find({
        deleted: false,
        examId: examId,
        userId: userId,
        isDone: isDone,
      }).count();
      let iiiiiiiiiii = await DoExamModel.find({
        deleted: false,
        examId: examId,
        userId: userId,
        isDone: isDone,
      });
      console.log(iiiiiiiiiii, "iiiiiiiiiii");
      exam = await pagination(
        DoExamModel.find({
          deleted: false,
          examId: examId,
          userId: userId,
          isDone: isDone,
        }),
        page,
        pageSize
      );
      // console.log(exam.length);
      for (let i = 0; i < exam.length; i++) {
        const element = exam[i]._doc;
        // console.log("-------------------", element.testId);

        const test = await TestModel.findById(element.testId);

        allExam = [...allExam, { ...element, test }];
      }

      if (exam.length > 0) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: allExam,
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
