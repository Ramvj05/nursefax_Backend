const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const theoryModel = require("../../../../model/theory.model");
const authorizer = require("../../../../middleware/authorizer");

const router = express.Router();

router.put("/update/:id", authorizer, async function (req, res) {
  try {
    const { user } = req.headers.user;
    const { id } = req.params;

    const uri = dbUri;
    await mongoose.connect(uri);
    // if (
    //   user.roles.includes("MODIFY_THEORY") ||
    //   user.roles.includes("STUDENT")
    // ) {
    const payload = req.body;

    console.log(payload);

    const updatedTheory = await theoryModel.findOneAndUpdate(
      {
        deleted: false,
        _id: id,
      },
      payload,
      {
        new: true,
      }
    );

    console.log(updatedTheory);
    if (updatedTheory) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: updatedTheory,
          message: "Theory update successfully",
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
          message: "No Theory Found",
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
