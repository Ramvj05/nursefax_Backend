const express = require("express");
const mongoose = require("mongoose");
const endpoints = require("../../../endpoints/endpoints");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const exampoolModel = require("../../../model/exampool.model");
const questionModel = require("../../../model/question.model");
const QuestionPoolModel = require("../../../model/questionpool.model");

const router = express.Router();

router.delete("/delete/:id", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("MODIFY_POOL")) {
      const oldData = await QuestionPoolModel.findOne({
        deleted: false,
        _id: id,
      });

      if (oldData) {
        Promise.all(
          oldData?.questions?.map(
            async (ele) =>
              await questionModel.findOneAndUpdate(
                {
                  deleted: false,
                  _id: ele,
                },
                { $pull: { testId: id } },
                {
                  new: true,
                }
              )
          )
        )
          .then(async () => {
            const exam = await exampoolModel.findOneAndUpdate(
              {
                type: "TEST",
                testId: id,
              },
              { deleted: true },
              {
                new: true,
              }
            );
            const examLearn = await exampoolModel.findOneAndUpdate(
              {
                type: "LEARN",
                testId: id,
              },
              { deleted: true },
              {
                new: true,
              }
            );
            const questionPool = await QuestionPoolModel.findOneAndUpdate(
              {
                deleted: false,
                _id: id,
              },
              { deleted: true },
              {
                new: true,
              }
            );

            console.log("questionPool ------->", questionPool);
            if (exam && examLearn && questionPool) {
              res
                .header({
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                })
                .status(200)
                .send({
                  data: questionPool,
                  message: "questionPool modified successfully",
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
                  message: "questionPool Not Found",
                  statsCode: 404,
                  error: {
                    message: "No data present",
                  },
                });
            }
          })
          .catch((err) => {
            console.log(err);
            res
              .header({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              })
              .status(500)
              .send({
                data: null,
                message: "Error",
                statsCode: 500,
                error: {
                  message: err,
                },
              });
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
            message: "Question Pool Not Found",
            statsCode: 404,
            error: {
              message: "Not Found",
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
          message: "You do not have access to modilfy questionPool",
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
