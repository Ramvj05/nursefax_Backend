const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const MockTestModel = require("../../../model/mocktest.model");
const QuestionModel = require("../../../model/question.model");
const MockExammodel = require("../../../model/mock-exam.model");
const randomShuffle = require("../../../utils/randomShuffle");
const MockTest = require("../../../class/mocktest.class");
const testModel = require("../../../model/test.model");

const router = express.Router();

router.get("/get/:id", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (
      user.roles.includes("LIST_EXAM") ||
      user.roles.includes("ADMIN") ||
      user.roles.includes("STUDENT")
    ) {
      const { showAnswer } = req?.query;
      const exam = await testModel.findOne({
        deleted: false,
        _id: id,
      });

      const mockTest = await MockTestModel.findOne({
        deleted: false,
        examId: id,
      });

      const mockExam = await MockExammodel.find({
        examId: id,
        deleted: false,
      });

      let mockQuesionData = [];
      let totalQuestionCount = 0;
      let totalQuestionSectionWise = [];
      if (mockTest) {
        for (let index = 0; index < mockTest?.sections?.length; index++) {
          const element = mockTest?.sections[index];
          let data = [];
          let uniqueQ = [...new Set([...element?.totalQuestion])];
          let suffledQuestion =
            mockExam?.length > 0 && mockExam[0]?.status === "ONGOING"
              ? uniqueQ
              : randomShuffle(uniqueQ.length, uniqueQ);

          if (showAnswer === "true") {
            data = await Promise.all(
              suffledQuestion?.map(
                async (ele) => await QuestionModel.findById(ele)
              )
            );
          } else {
            data = await Promise.all(
              suffledQuestion?.map(
                async (ele) =>
                  await QuestionModel.findById(
                    ele,

                    {
                      correctAnswer: 0,
                      explanation: 0,
                    }
                  )
              )
            );
          }
          totalQuestionCount = totalQuestionCount + data.length;
          totalQuestionSectionWise = [
            ...totalQuestionSectionWise,
            {
              title: element.heading,
              count: data.length,
            },
          ];
          mockQuesionData = [
            ...mockQuesionData,
            {
              ...element["_doc"],
              totalQuestion: suffledQuestion,
              questions: data,
            },
          ];
        }
        const x = new MockTest({
          ...mockTest["_doc"],
          mockExam: mockExam.length > 0 ? mockExam[0] : [],
          sections: mockQuesionData,
          totalQuestionCount,
          totalQuestionSectionWise,
        });
        await MockTestModel.findOneAndUpdate(
          {
            deleted: false,
            examId: id,
          },
          x,
          { new: true }
        );

        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: {
              ...mockTest["_doc"],
              mockExam: mockExam.length > 0 ? mockExam[0] : [],
              sections: mockQuesionData,
              totalQuestionCount,
              totalQuestionSectionWise,
              examName: exam?.name || "",
            },
            message: "mockTest found successfully",
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
            message: "No mockTest Found",
            statsCode: 404,
            error: {
              message: "No data present",
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
          message: "You do not have access to get mockTest",
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
