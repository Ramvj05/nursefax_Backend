const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const QuestionModel = require("../../../../model/course/question.model");
const courseAdminModel = require("../../../../model/courseAdmin.model");

const router = express.Router();

router.post("/list", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);
  let query = {
    deleted: false,
  };

  Object.entries(req.body).map(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        query = { ...query, [key]: value };
      } else {
        query = { ...query, [key]: { $all: value } };
      }
    } else {
      if (value && !Array.isArray(value)) {
        query = { ...query, [key]: value };
      }
    }
  });

  console.log("query ---------> ", JSON.stringify(query, null, 2));

  try {
    if (
      user.roles.includes("LIST_QUESTIONS") ||
      user.roles.includes("STUDENT")
    ) {
      let questions;
      if (!user.roles.includes("STUDENT")) {
        questions = await QuestionModel.find(query);
      } else {
        questions = await QuestionModel.find(query, { correctAnswer: 0 });
      }

      // console.log("questions.length", questions.length);
      if (questions.length > 0) {
        const data = [];

        for (let index = 0; index < questions.length; index++) {
          const element = questions[index];
          const csAdminId = element.updatedBy
            ? element.updatedBy
            : element.createdBy;
          const userResult = await courseAdminModel.findOne({
            deleted: false,
            _id: csAdminId,
          });
          // console.log("userResult", userResult);
          data.push({ ...element._doc, author: userResult._doc.fullName });
        }

        if (data && data.length > 0) {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              data: data,
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
              message: "No Questions Found",
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
          .status(200)
          .send({
            data: [],
            message: "No Questions Found",
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
