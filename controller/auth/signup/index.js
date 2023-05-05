const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserClass = require("../../../class/user.class");
const { dbUri } = require("../../../endpoints/endpoints");
const User = require("../../../model/user.model");
const { generateHash, generateSalt } = require("../../../utils/encrypt");
const decrypy = require("../../../utils/decrypt");
const courseAdminModel = require("../../../model/courseAdmin.model");
const EmployerModel = require("../../../model/TableCollections/TableEmployers");
const router = express.Router();
var geoip = require("geoip-lite");

router.post("/signup", async function (req, res) {
  let body = new UserClass(req.body).getModel();
  const uri = dbUri;
  await mongoose.connect(uri);

  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress;
  const location = geoip.lookup(ip);
  // const Country = location.country
  body = {
    ...body,
    createdBy:
      body.userType === 2
        ? "student"
        : body.userType === 1
        ? "user"
        : body.userType === 0
        ? "admin"
        : "employer",
    roles:
      body.userType === 2
        ? ["STUDENT"]
        : body.userType === 1
        ? []
        : body.userType === 0
        ? ["ADMIN"]
        : ["EMPLOYER"],
    // body.userType === 0 ? ["ADMIN"] : body.userType === 1 ? [] : ["STUDENT"],
    // UserCountry:
    //   body.userType === 2 ? Country: ""
  };

  let salt = generateSalt();
  const hashPassword = generateHash(body.password, salt);

  body = {
    ...body,
    password: hashPassword,
    // Country:Country,
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
  } else if (parseInt(body.userType) === 4) {
    newUser = new EmployerModel(body);
    presentUser = false;

    presentUser = await EmployerModel.findOne(
      {
        email: newUser.email,
      }
      // { password: 0 }
    );
  } else {
    newUser = new User(body);
    presentUser = false;
    // presentUser = await User.findOne(
    //   {
    //     mobile: newUser.mobile,
    //   },
    //   { password: 0 }
    // );
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
          message: "User Created Successfully",
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
          error: { message: "User exist already" },
          message: "user already exist",
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
