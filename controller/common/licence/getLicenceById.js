const express = require("express");
const mongooes = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();
const LicenseModel = require("../../../model/license.model");
const userModel = require("../../../model/user.model");
const courseModel = require("../../../model/course.model");
const examModel = require("../../../model/test.model");
const trainingModel = require("../../../model/training.model");

router.get("/get-licences/:id", authorizer, async (req, res) => {
  const { user } = req.headers.user;
  const { id } = req.params;
  // console.log(user, "usersssss");
  await mongooes.connect(dbUri);
  if (user.roles.includes("ADMIN")) {
    let query = {
      _id: id,
      deleted: false,
    };
    try {
      const licenceData = await LicenseModel.findOne(query);
      const userData = await userModel.findOne(
        {
          _id: licenceData?.studentId,
          userType: 2,
          deleted: false,
        },
        { password: 0 }
      );
      let courseData;
      if (licenceData?.type === "COURSE") {
        courseData = await courseModel.findOne({
          _id: licenceData?.courseId,
          deleted: false,
        });
      } else if (licenceData?.type === "TRAINING") {
        courseData = await trainingModel.findOne({
          _id: licenceData?.courseId,
          deleted: false,
        });
      } else {
        const findingId = licenceData?.courseId
          ? licenceData?.courseId
          : licenceData?.examId;
        courseData = await examModel.findOne({
          _id: findingId,
          deleted: false,
        });
      }
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data: {
            ...licenceData?._doc,
            user: userData,
            course: courseData,
          },
          message: "Data Found",
          error: null,
        });
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
  } else if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    let query = {
      courseId: id,
      deleted: false,
    };
    try {
      const licenceData = await LicenseModel.findOne(query);
      const OtherState = {
        Base_Total: licenceData.paidAmount / 1.18,
        GST: licenceData.paidAmount - licenceData.paidAmount / 1.18,
      };
      let GSTs = licenceData.paidAmount - licenceData.paidAmount / 1.18;
      let GSTss = GSTs / 2;
      const TamilNadu = {
        CGST: GSTss,
        SGST: GSTss,
        Base_Total: licenceData.paidAmount / 1.18,
      };
      const userData = await userModel.findOne(
        {
          _id: licenceData?.studentId,
          userType: 2,
          deleted: false,
        },
        { password: 0 }
      );
      let courseData;
      if (licenceData?.type === "COURSE") {
        courseData = await courseModel.findOne({
          _id: licenceData?.courseId,
          deleted: false,
        });
      } else if (licenceData?.type === "TRAINING") {
        courseData = await trainingModel.findOne({
          _id: licenceData?.courseId,
          deleted: false,
        });
      } else {
        const findingId = licenceData?.courseId
          ? licenceData?.courseId
          : licenceData?.examId;
        courseData = await examModel.findOne({
          _id: findingId,
          deleted: false,
        });
      }
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data: {
            ...licenceData?._doc,
            user: userData,
            course: courseData,
            OtherState: OtherState,
            TamilNadu: TamilNadu,
          },
          message: "Data Found",
          error: null,
        });
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
  } else {
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(404)
      .send({
        statsCode: 404,
        data: null,
        message: "Do not access to list licence details",
        error: { message: "Access denied." },
      });
  }
});

module.exports = router;
