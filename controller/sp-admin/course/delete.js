const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const CourseModel = require("../../../model/course.model");

const router = express.Router();

router.delete("/delete/:id", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("ADMIN")) {
      const test = await CourseModel.findOneAndUpdate(
        {
          deleted: false,
          _id: id,
        },
        { deleted: true },
        {
          new: true,
        }
      );

      console.log(test);
      if (test) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: test,
            message: "course modified successfully",
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
            message: "course Not Found",
            statsCode: 404,
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
          message: "You do not have access to modilfy course",
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
