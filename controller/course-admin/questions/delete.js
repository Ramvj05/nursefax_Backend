const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const QuestionModel = require("../../../model/question.model");

const QuestionPoolModel = require("../../../model/questionpool.model");

const router = express.Router();

router.delete("/delete-question/:id", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("MODIFY_QUESTIONS")) {
      const questionPoolResources = await QuestionPoolModel.find({
        questions: { $all: [id] },
      });

      let handler = [];
      if (questionPoolResources && questionPoolResources.length > 0) {
        handler = [
          ...handler,
          {
            resources: questionPoolResources.map((ele) => ({
              name: ele.topic,
              id: ele["_id"],
              type: "Question Pool",
            })),
          },
        ];
      }

      console.log("resouse---", {
        resources: questionPoolResources.map((ele) => ({
          name: ele.topic,
          id: ele["_id"],
          type: "Question Pool",
        })),
      });
      console.log("handler", handler);
      if (handler && handler.length > 0) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(401)
          .send({
            data: null,
            message:
              "You cannot delete Question, it is bind with some resources, You need to unbind the resources first",
            handler,
            statsCode: 401,
            error: {
              message: "Access denied",
            },
          });
      } else {
        const question = await QuestionModel.findOneAndUpdate(
          {
            deleted: false,
            _id: id,
          },
          { deleted: true },
          {
            new: true,
          }
        );

        console.log(question);
        if (question) {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              data: question,
              message: "Question deleted successfully",
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
              message: "Question Not Found",
              statsCode: 404,
              error: {
                message: "No data present",
              },
            });
        }
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
          message: "You do not have access to modilfy question",
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
