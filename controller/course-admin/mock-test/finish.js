const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

const MockExamModel = require("../../../model/mock-exam.model");
const MockTestModel = require("../../../model/mocktest.model");
const QuestionModel = require("../../../model/question.model");

router.get("/finish/:id", authorizer, async (req, res) => {
  await mongoose.connect(dbUri);
  try {
    const { id } = req?.params;

    const exam = await MockExamModel.findById(id);

    const mocktest = await MockTestModel.findOne({
      _id: exam?.mockId,
      deleted: false,
    });

    if (exam && mocktest) {
      let sectionData = {};

      for (let i = 0; i < mocktest.sections.length; i++) {
        const element = mocktest.sections[i];
        let sectionsQuestions = await Promise.all(
          element.totalQuestion.map(
            async (ele) => await QuestionModel.findById(ele)
          )
        );
        sectionData = {
          ...sectionData,
          [element._id.toString()]: sectionsQuestions,
        };
      }

      console.warn(sectionData);
      const { questionData } = exam;

      let result = Object.entries(sectionData).map(([key, value], eleIndex) => {
        let correctAnswer = [];
        let wrongAnswer = [];
        let notAnswered = [];
        let data = {};

        if (questionData.hasOwnProperty(key)) {
          for (let index = 0; index < value.length; index++) {
            const questionFromQB = value[index];

            for (let j = 0; j < questionData[key].length; j++) {
              const userQuestion = questionData[key][j];

              if (
                userQuestion._id.toString() === questionFromQB._id.toString()
              ) {
                if (
                  userQuestion.action === "FINISHED" ||
                  userQuestion.action === "REVIEW"
                ) {
                  if (
                    questionFromQB.correctAnswer
                      .map((ele) => ele.value)
                      .includes(userQuestion.userAnswer)
                  ) {
                    console.warn("User answer correct one  ");
                    correctAnswer = [...correctAnswer, userQuestion];
                  } else {
                    console.log("User answer wrong one");
                    wrongAnswer = [...wrongAnswer, userQuestion];
                  }
                } else {
                  notAnswered = [...notAnswered, userQuestion];
                }
              }
            }
          }

          data = {
            question: value,
            section: mocktest.sections[eleIndex],
            result: {
              correctAnswer,
              wrongAnswer,
              notAnswered: [
                ...value.filter(
                  (ele) =>
                    !questionData[key]
                      .map((e) => e._id.toString())
                      .includes(ele._id.toString())
                ),
                ...notAnswered,
              ],
            },
          };
        } else {
          data = {
            question: value,
            section: mocktest.sections[eleIndex],
            result: {
              correctAnswer: [],
              wrongAnswer: [],
              notAnswered: value,
            },
          };
        }
        return data;
      });

      const data = await MockExamModel.findOneAndUpdate(
        { _id: id },
        { status: "COMPLETED", result, finishedOn: new Date() },
        { new: true }
      );
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data,
          message: "Exam end successfully",
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
          statsCode: 404,
          data: null,
          message: "No Mock test found",
          error: {
            message: "Data not found",
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
