const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const CommunityModel = require("../../../model/community/community.model");
const pagination = require("../../../utils/pagination");

const router = express.Router();

router.get("/list", async function (req, res) {
  // const { user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    // if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    let query = {
      deleted: false,
    };
    const { page, pageSize } = req.query;
    const totalElements = await CommunityModel.find(query).count();
    let community;

    console.log(page, pageSize);
    community = await pagination(CommunityModel.find(query), page, pageSize);

    if (community.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: community,
          message: "Data listed successfully",
          statsCode: 200,
          pageable: {
            totalElements,
            page,
            pageSize,
            currentSize: community.length,
            hasNextPage:
              page && pageSize ? pageSize * page < totalElements : false,
            hasPreviousPage: page ? page > 1 : false,
            totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
          },
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
          message: "No community Found",
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
