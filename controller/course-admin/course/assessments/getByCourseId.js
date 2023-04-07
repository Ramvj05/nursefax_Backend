const mongoose = require("mongoose");
const express = require("express");
const assessmentModel = require("../../../../model/course/assessment.model");
const assQuestionModel = require("../../../../model/course/question.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const router = express.Router();

router.get("/get-by-course/:id", authorizer, async (req, res) => {
  try {
    await mongoose.connect(dbUri);

    const { id } = req.params;

    // if (
    //   user.roles.includes("LIST_THEORY") ||
    //   user.roles.includes("ADMIN") ||
    //   user.roles.includes("STUDENT")
    // ) {
    let data = {};
    data = await assessmentModel.find({
      courseId: { $all: [id] },
      deleted: false,
    });

    let questionsCount = await assQuestionModel
      .find({
        courseId: { $all: [id] },
        deleted: false,
      })
      .count();

    if (data && data?.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: { ...data?.[0]?._doc, questionsCount: questionsCount },
          message: "Course Assessment found sucessfully",
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
