const express = require("express");
const mongoose = require("mongoose");
const CourseCategoryClass = require("../../../../class/classification/theory.class");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const CourseCategoryModel = require("../../../../model/classification/theory.model");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  let body = new CourseCategoryClass(req.body).getModel();
  console.log(body);
  const uri = dbUri;
  await mongoose.connect(uri);

  body = {
    ...body,
    createdBy: decodeToken.id,
  };

  try {
    if (
      user.roles.includes("CREATE_CATEGORY") ||
      user.roles.includes("ADMIN")
    ) {
      const newCourseCategoryModel = new CourseCategoryModel(body);
      const data = await newCourseCategoryModel.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "category Created Successfully",
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
          message: "You do not have access to create category",
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
