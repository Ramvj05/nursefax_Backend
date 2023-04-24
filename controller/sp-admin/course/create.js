const express = require("express");
const mongoose = require("mongoose");
const CourseClass = require("../../../class/course.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const CourseModel = require("../../../model/course.model");
const router = express.Router();

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  console.log(req.headers.user,"req.headers.userreq.headers.userreq.headers.userreq.headers.userreq.headers.userreq.headers.user")
  let body = new CourseClass(req.body).getModel();
  console.log(body);
  const uri = dbUri;
  await mongoose.connect(uri);

  const count = await CourseModel.find({}).count();

  let courseId;
  if (count < 10) {
    courseId = `CSID-00000${count + 1}`;
  } else if (count < 100) {
    courseId = `CSID-0000${count + 1}`;
  } else if (count < 1000) {
    courseId = `CSID-000${count + 1}`;
  } else if (count < 10000) {
    courseId = `CSID-00${count + 1}`;
  } else if (count < 100000) {
    courseId = `CSID-0${count + 1}`;
  } else {
    courseId = `CSID-${count + 1}`;
  }
  body = {
    ...body,
    courseId,
    createdBy: decodeToken.id,
  };

  console.log(body);

  try {
    if (user.roles.includes("CREATE_COURSE") || user.roles.includes("ADMIN")) {
      const newCourseModel = new CourseModel(body);
      const data = await newCourseModel.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "Course Created Successfully",
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
          message: "You do not have access to create course",
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
