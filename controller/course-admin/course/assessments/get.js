const mongoose = require("mongoose");
const express = require("express");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const assessmentModel = require("../../../../model/course/assessment.model");
const router = express.Router();

router.get("/get/:id", authorizer, async (req, res) => {
  try {
    const { user } = req.headers.user;
    await mongoose.connect(dbUri);

    const { id } = req.params;

    // if (
    //   user.roles.includes("LIST_THEORY") ||
    //   user.roles.includes("ADMIN") ||
    //   user.roles.includes("STUDENT")
    // ) {
    const data = await assessmentModel.findOne({
      _id: id,
      deleted: false,
    });
    console.log(data);
    if (data) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "Course Assessment listed sucessfully",
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
          message: "Data not found",
          statsCode: 404,
          error: {
            message: "Assessment not found",
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
    //       message: "You do not have access to create Theory",
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
