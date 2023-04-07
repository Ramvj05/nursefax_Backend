const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const QuestionModel = require("../../../model/question.model");
const pagination = require("../../../utils/pagination");
const router = express.Router();

router.post("/search", authorizer, async function (req, res) {
  const uri = dbUri;
  await mongoose.connect(uri);

  const { user } = req.headers.user;

  const payload = req.body;
  const keyword = payload.keyword;

  delete req?.body?.keyword;

  const nKeyword = keyword?.toLowerCase()?.split(" ");

  const containQID = keyword?.split("-")?.[0] === "QID";

  console.log("containQID ---------->>", containQID);

  const newPayload = containQID
    ? { ...payload, qId: payload.keyword }
    : payload;

  const query = containQID
    ? {
        $and: [
          {
            deleted: false,
          },
          {
            examId: {
              $all: payload.examId,
            },
          },
          {
            qId: keyword,
          },
        ],
      }
    : {
        $and: [
          {
            deleted: false,
          },
          {
            examId: {
              $all: payload.examId,
            },
          },
        ],
      };

  //   Object.entries(newPayload).map(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       if (value.length === 0) {
  //         query = { ...query, [key]: value };
  //       } else {
  //         query = { ...query, [key]: { $all: value } };
  //       }
  //     } else {
  //       if (value && !Array.isArray(value)) {
  //         query = { ...query, [key]: value };
  //       }
  //     }
  //   });

  try {
    if (user.roles.includes("LIST_QUESTIONS") || user.roles.includes("ADMIN")) {
      console.log("nKeyword", nKeyword, keyword);
      console.log("query", query);
      let result = await QuestionModel.find(query);
      const newData =
        result?.length > 0
          ? result
              ?.map((ele) => {
                if (containQID) {
                  return ele;
                } else {
                  const question = ele?.question?.toLowerCase();
                  const a = question?.split("<p>")?.join("");
                  const b = a?.split("</p>")?.join("");
                  const c = b?.split(".")?.join("");
                  const d = c?.split("?")?.join("");
                  const e = d?.split(":")?.join("");
                  const f = e?.split(";")?.join("");
                  const g = f?.split("'")?.join("");
                  const h = g?.split(" ");
                  const contain =
                    h?.filter((ele) => nKeyword?.includes(ele))?.length > 0;
                  if (contain) {
                    return ele;
                  } else return null;
                }
              })
              ?.filter((ele) => ele !== null)
          : [];

      if (newData.length > 0) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: newData,
            message: "Data listed successfully",
            statsCode: 200,
            // pageable: {
            //   totalElements,
            //   page,
            //   pageSize,
            //   currentSize: questions.length,
            //   hasNextPage:
            //     page && pageSize ? pageSize * page < totalElements : false,
            //   hasPreviousPage: page ? page > 1 : false,
            //   totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
            // },
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
            message: "No Questions Found",
            statsCode: 200,
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
          message: "You do not have access to get question",
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
