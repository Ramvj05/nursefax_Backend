const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const assessmentModel = require("../../../../model/course/assessment.model");
const authorizer = require("../../../../middleware/authorizer");

const router = express.Router();

router.put("/update/:id", authorizer, async function (req, res) {
  try {
    const { decodeToken } = req.headers.user;
    const { id } = req.params;

    const uri = dbUri;
    await mongoose.connect(uri);
    // if (
    //   user.roles.includes("MODIFY_THEORY") ||
    //   user.roles.includes("STUDENT")
    // ) {
    const payload = req.body;

    // console.log(payload);

    const updatedAssessment = await assessmentModel.findOneAndUpdate(
      {
        deleted: false,
        _id: id,
      },
      { ...payload, updatedBy: decodeToken.id },
      {
        new: true,
      }
    );

    // console.log(updatedAssessment);
    if (updatedAssessment) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: updatedAssessment,
          message: "Course Assessment Update Successfully",
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
          message: "No Assessment Found",
          statsCode: 404,
          error: {
            message: "No data present",
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
    //       message: "You do not have access to modify Theory",
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
