const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../../../../model/user.model");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");

const router = express.Router();

router.get("/getById/:id", authorizer, async function (req, res) {
  const { decodeToken, user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    // if (user.roles.includes("ADMIN")) {
    const presentUser = await userModel.findOne(
      {
        deleted: false,
        active: true,
        _id: id,
      },
      { password: 0 }
    );

    console.log(presentUser);
    if (presentUser) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: presentUser,
          message: "User found successfully",
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
          message: "No Users Found",
          statsCode: 404,
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
