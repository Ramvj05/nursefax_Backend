const mongoose = require("mongoose");
const express = require("express");
const assessmentModel = require("../../../../model/course/assessment.model");
const assQuestionModel = require("../../../../model/course/question.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const theoryModel = require("../../../../model/theory.model");
const subTheoryModel = require("../../../../model/sub_theory.model");
const finishedSubtheoryModel = require("../../../../model/course/finished_subtheory.model");
const router = express.Router();

router.get("/get-by-course-for-user/:id", authorizer, async (req, res) => {
  try {
    const { decodeToken, user } = req.headers.user;
    await mongoose.connect(dbUri);

    const { id } = req.params;

    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      let theoryData = await theoryModel.find({
        deleted: false,
        courseId: { $all: [id] },
      });

      let newData = [];

      if (theoryData && Array.isArray(theoryData) && theoryData.length > 0) {
        for (let index = 0; index < theoryData.length; index++) {
          const element = theoryData[index];
          const subTData = await subTheoryModel.find({
            deleted: false,
            theoryId: { $all: [element?._id] },
          });
          let totalSubTheories = subTData?.length;
          let completedSubTheories = 0;
          let inCompleteSubTheories = 0;
          if (subTData && Array.isArray(subTData) && subTData.length > 0) {
            for (let index = 0; index < subTData.length; index++) {
              const subElement = subTData[index];
              const completedResult = await finishedSubtheoryModel.findOne({
                userId: decodeToken?.id,
                theoryId: subElement?.theoryId?.[0],
                subTheoryId: subElement?._id,
              });
              if (
                completedResult &&
                (completedResult?._doc?.isDone || completedResult?.isDone)
              ) {
                completedSubTheories = completedSubTheories + 1;
              } else {
                inCompleteSubTheories = inCompleteSubTheories + 1;
              }
            }
          }
          newData = [
            ...newData,
            {
              ...element?._doc,
              total_sub_theories: totalSubTheories,
              completed_sub_theories: completedSubTheories,
              incomplete_sub_theories: inCompleteSubTheories,
            },
          ];
        }
      }

      let eligible;

      console.log("newData --------------->>>>>>>>>>>>", newData);
      console.log(
        "newData?.filter((ele) => ele?.incomplete_sub_theories > 0)?.length > 0",
        newData?.filter((ele) => ele?.incomplete_sub_theories >= 0)?.length > 0
      );

      if (newData && newData?.length > 0) {
        if (
          newData?.filter((ele) => ele?.incomplete_sub_theories === 0)
            ?.length === newData?.length
        ) {
          eligible = true;
        } else {
          eligible = false;
        }
      } else {
        eligible = false;
      }

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
            data: {
              ...data?.[0]?._doc,
              questionsCount: questionsCount,
              eligible: eligible,
            },
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
