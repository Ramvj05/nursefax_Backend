const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const PostModel = require("../../../../model/jobs/post.model");

const router = express.Router();

router.get("/list", async function (req, res) {
  const uri = dbUri;
  // await mongoose.disconnect();
  await mongoose.connect(uri);

  try {
    // if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    let query = {
      deleted: false,
    };
    const category = await PostModel.find(query);
    // await mongoose.disconnect();

    if (category.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: category,
          message: "Data listed successfully",
          statsCode: 200,
          error: null,
        });
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: [],
          message: "No posts Found",
          statsCode: 200,
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
    //       message: "You do not have access to get question",
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
