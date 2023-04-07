const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const finishTheoryModel = require("../../../../model/course/finished_theory.model");

const router = express.Router();

router.post("/theory", authorizer, async function (req, res) {
  const { user, decodeToken } = req.headers.user;
  const { courseId, theoryId } = req.body;

  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("STUDENT")) {
      const body = {
        courseId: courseId,
        theoryId: theoryId,
        isDone: true,
        time: new Date().toISOString(),
        finishedOn: new Date().toISOString(),
        userId: decodeToken.id,
        createdBy: decodeToken.id,
      };
      const finishTheory = new finishTheoryModel(body);
      await finishTheory.save();
      if (finishTheory) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: finishTheory,
            message: "Congratulations, You completed the theory",
            statsCode: 200,
            error: null,
          });
      } else {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(401)
          .send({
            data: null,
            message: "Make sure you attempt all theories",
            statsCode: 401,
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
          message: "You do not have access to finish theory.",
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
