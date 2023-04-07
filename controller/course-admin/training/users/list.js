const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const licenseModel = require("../../../../model/license.model");
const userModel = require("../../../../model/user.model");
const pagination = require("../../../../utils/pagination");

const router = express.Router();

router.post("/list", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    // if (user.roles.includes("ADMIN")) {
    let query = {
      deleted: false,
      active: true,
      courseId: req.body.courseId,
      // createdBy: decodeToken.id,
    };

    let { page, pageSize } = req.body;

    let totalElements = await licenseModel.find(query).count();

    let licenseResult = await pagination(
      licenseModel.find(query),
      page,
      pageSize
    );

    let users = [];

    for (let index = 0; index < licenseResult.length; index++) {
      const element = licenseResult[index];
      const userResult = await userModel.findOne(
        {
          _id: element.studentId,
          deleted: false,
          active: true,
        },
        {
          password: 0,
        }
      );
      users = [
        ...users,
        {
          ...userResult?._doc,
          licenseDetails: element._doc,
        },
      ];
    }
    console.log("users--------->", users);

    if (users.length > 0) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: {
            data: users,
            pageable: {
              totalElements,
              page,
              pageSize,
              currentSize: users.length,
              hasNextPage:
                page && pageSize ? pageSize * page < totalElements : false,
              hasPreviousPage: page ? page > 1 : false,
              totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
            },
          },
          message: "Data listed successfully",
          statsCode: 200,
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
          message: "No Users Found",
          statsCode: 200,
          error: {
            message: "No data present",
          },
        });
    }
    // } else {
    // 	res
    // 		.header({
    // 			"Content-Type": "application/json",
    // 			"Access-Control-Allow-Origin": "*",
    // 		})
    // 		.status(401)
    // 		.send({
    // 			statsCode: 401,
    // 			data: null,
    // 			message: "You dont have access to get course admin",
    // 			error: {
    // 				message: "Access Denied",
    // 			},
    // 		});
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
