const express = require("express");
const authorizer = require("../../../middleware/authorizer");
const examTheorymodel = require("../../../model/exam_theory.model");
const router = express.Router();
const mongooes = require("mongoose");

router.get("/show-result/:id", authorizer, async (req, res) => {
  try {
    const { user } = req.headers.user;
    await mongooes.connect(dbUri);

    const { id } = req.params;

    // if (
    //   user.roles.includes("LIST_THEORY") ||
    //   user.roles.includes("ADMIN") ||
    //   user.roles.includes("STUDENT")
    // ) {
    const data = await examTheorymodel.find({
      emamId: { $all: [id] },
      studentId: { $all: [user.id.toString()] },
      deleted: false,
    });
    console.log(data);
    let complete = [];
    let incomplete = data.filter((ele) => {
      if (ele.complete) {
        complete = [...complete, ele];
      } else {
        incomplete = [...incomplete, ele];
      }
    });

    if (data) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: {
            complete,
            totalCompleteCount: complete?.length,
            incomplete,
            totalIncompleteCount: incomplete?.length,
            totalCount: data?.length,
            total: data,
            completionRate: (complete?.length / data?.length) * 100,
            inCompletionRate: (incomplete?.length / data?.length) * 100,
          },
          message: "Theory result Successfully",
          statsCode: 200,
          error: null,
        });
      // } else {
      //   res
      //     .header({
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //     })
      //     .status(404)
      //     .send({
      //       data: null,
      //       message: "Data not found",
      //       statsCode: 404,
      //       error: {
      //         message: "Theory not found",
      //       },
      //     });
      // }
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
