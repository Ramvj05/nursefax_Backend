const mongoose = require("mongoose");
const express = require("express");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const takeAssessmentModel = require("../../../../model/course/take_assessment.model");
const router = express.Router();

router.get("/status/:id", authorizer, async (req, res) => {
  try {
    const { decodeToken, user } = req.headers.user;
    await mongoose.connect(dbUri);

    const { id } = req.params;

    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      let data = [];
      data = await takeAssessmentModel.find({
        courseId: id,
        userId: decodeToken.id,
        isFinished: true,
        deleted: false,
      });

      let eligible;

      console.log(
        "eligible ------->",
        data?.filter(
          (ele) =>
            (ele?.result?.correctAnswer?.count * 100) /
              ele?.result?.totalQuestion?.count >
            79
        )?.length > 0
      );

      if (data && data?.length > 0) {
        if (
          data?.filter(
            (ele) =>
              (ele?.result?.correctAnswer?.count * 100) /
                ele?.result?.totalQuestion?.count >
              79
          )?.length > 0
        ) {
          eligible = true;
        } else {
          eligible = false;
        }
      } else {
        eligible = false;
      }

      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: eligible,
          message: "Status Found Successfully",
          statsCode: 200,
          error: null,
        });
      //   } else {
      //     res
      //       .header({
      //         "Content-Type": "application/json",
      //         "Access-Control-Allow-Origin": "*",
      //       })
      //       .status(404)
      //       .send({
      //         data: null,
      //         message: "Data not found",
      //         statsCode: 404,
      //         error: {
      //           message: "Assessment not found",
      //         },
      //       });
      //   }
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(401)
        .send({
          data: null,
          message: "You do not have access to create Theory",
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
