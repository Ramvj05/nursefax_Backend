const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const CourseAdminClass = require("../../../class/courseAdmin.class");
const { dbUri } = require("../../../endpoints/endpoints");
const CourseAdmin = require("../../../model/courseAdmin.model");
const authorizer = require("../../../middleware/authorizer");
const { generateHash, generateSalt } = require("../../../utils/encrypt");
const router = express.Router();

router.post("/create-course-admin", authorizer, async function (req, res) {
  const { decodeToken } = req.headers.user;
  let body = new CourseAdminClass(req.body).getModel();

  const uri = dbUri;
  await mongoose.connect(uri);
  try {
    if (decodeToken.userType === 0) {
      let salt = generateSalt();
      const hashPassword = generateHash(body.password, salt);
      body = {
        ...body,
        password: hashPassword,
        userType: 1,
      };
      const newCourseAdmin = new CourseAdmin(body);
      const presentUser = await CourseAdmin.findOne(
        {
          $or: [
            {
              userName: newCourseAdmin.userName,
            },
            {
              email: newCourseAdmin.email,
            },
            {
              mobile: newCourseAdmin.mobile,
            },
          ],
        },
        { password: 0 }
      );
      if (!presentUser) {
        const data = await newCourseAdmin.save();
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: data,
            message: "Course Admin Created Successfully",
            statsCode: 200,
            error: null,
          });
      } else {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(500)
          .send({
            statsCode: 500,
            data: null,
            error: { error: "Course Admin exist already" },
            message: "Course Admin already exist",
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
          message: "You do not have access to create Course Admin",
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
