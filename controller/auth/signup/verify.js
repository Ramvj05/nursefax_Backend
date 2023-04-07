const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { dbUri } = require("../../../endpoints/endpoints");
const User = require("../../../model/user.model");
const { generateHash, generateSalt } = require("../../../utils/encrypt");
const decrypy = require("../../../utils/decrypt");
const courseAdminModel = require("../../../model/courseAdmin.model");
const router = express.Router();

router.post("/signup", async function (req, res) {
  let body = req.body;
  const uri = dbUri;
  await mongoose.connect(uri);

  console.log(body);

  let salt = generateSalt();
  const hashPassword = generateHash(body.password, salt);
  body = {
    ...body,
    password: hashPassword,
  };

  let presentUser;
  let newUser;

  if (body.userType === 1) {
    newUser = new courseAdminModel(body);
    presentUser = await courseAdminModel.findOne(
      {
        mobile: newUser.mobile,
      },
      { password: 0 }
    );
  } else {
    newUser = new User(body);
    presentUser = await User.findOne(
      {
        mobile: newUser.mobile,
      },
      { password: 0 }
    );
  }

  try {
    if (!presentUser) {
      const data = await newUser.save();
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: data,
          message: "User Verified Successfully",
          statsCode: 200,
          error: null,
        });
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(500)
        .send({
          statsCode: 500,
          data: {
            mobile: true,
          },
          error: { message: "User already verified" },
          message: "user already verified",
        });
    }
  } catch (err) {
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
