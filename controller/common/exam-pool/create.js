const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();

const ExamPoolModel = require("../../../model/exampool.model");
const TestPool = require("../../../model/questionpool.model");
const Exam = require("../../../model/test.model");

router.post("/create", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);

  const { testIds, examId, status } = req.body;

  console.log("req.body", req.body);
  try {
    if (user.roles.includes("CREATE_EXAM") || user.roles.includes("ADMIN")) {
      if (
        testIds &&
        Array.isArray(testIds) &&
        testIds.length > 0 &&
        typeof examId === "string" &&
        examId !== ""
      ) {
        console.log("------------------------------->", req.body);
        let data = [];
        for (let index = 0; index < testIds.length; index++) {
          const ele = testIds[index];
          const testPool = await TestPool.findOne({ deleted: false, _id: ele });
          const { qbId } = testPool;
          const exam = await Exam.findOne({ deleted: false, _id: examId });
          const { examId: examDataId } = exam;

          const body = {
            examId,
            tId: qbId,
            eId: examDataId,
            testId: ele,
            status: status ? status : "CREATED",
            createdBy: decodeToken.id,
            type: req?.body?.type,
          };
          const examPool = new ExamPoolModel(body);
          let d = await examPool.save();
          data = [...data, d];
        }

        // let data = testIds.map(async (ele) => {

        // 	return dataHand;
        // });

        console.log("data ----> ", data);
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: null,
            message: "Exam Created Successfully",
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
            message: "Check your payload",
            statsCode: 200,
            error: { message: "Bad Request" },
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
          message: "You do not have access to create exam",
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
