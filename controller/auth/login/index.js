const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { dbUri } = require("../../../endpoints/endpoints");
const User = require("../../../model/user.model");
const LoginClass = require("../../../class/login.class");
const CourseAdminModel = require("../../../model/courseAdmin.model");
const decrypy = require("../../../utils/decrypt");
const EmployerModel = require("../../../model/TableCollections/TableEmployers");

const router = express.Router();

router.post("/login", async function (req, res) {
  try {
    let body = new LoginClass(req.body).getModel();
    const uri = dbUri;
    await mongoose.connect(uri);
    const { userName, password, userType } = body;
    let user = null;
    if (userType === 1) {
      user = await CourseAdminModel.findOne({
        deleted: false,
        $or: [
          {
            email: userName,
          },
          {
            mobile: userName,
          },
        ],
        $and: [
          {
            userType,
          },
        ],
      });
    } else if (userType === 4) {
      user = await EmployerModel.findOne({
        is_delete: false,
        $or: [
          {
            email: userName,
          },
          {
            mobile: userName,
          },
        ],
        $and: [
          {
            userType,
          },
        ],
      });
    } else {
      user = await User.findOne({
        deleted: false,
        $or: [
          {
            email: userName,
          },
          {
            mobile: userName,
          },
        ],
        // $and: [
        //   {
        //     userType,
        //   },
        // ],
      });
    }

    if (!user) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(404)
        .json({
          statsCode: 404,
          data: null,
          error: {
            error: "User not found",
          },
          message: "Check the credentials carefully",
        });
    } else {
      // const result = decrypy(password, user.password);
      result = decrypy(password, user.password);
      if (!result) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(401)
          .json({
            statsCode: 401,
            data: null,
            error: {
              message: "Un-authorized",
            },
            message: "please check the username and password",
          });
      } else {
        const token = jwt.sign(
          {
            fullName: user?.fullName,
            firstName: user?.firstName,
            lastName: user?.lastName,
            id: user._id.toString(),
            userType: user.userType,
            country: user.country,
            countryCode: user.countryCode,
            avatarUrl: user?.picture || user?.profileUri || "",
          },
          process.env.KEY_FOR_AUTH,
          {
            expiresIn:
              user.userType === 0
                ? "4h"
                : user.userType === 1 || user.userType === 3
                ? "3h"
                : "24h",
          }
        );

        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .json({
            statsCode: 200,
            data: { token, userId: user._id.toString() },
            error: null,
            message: "User validate successfully",
          });
      }
    }
  } catch (err) {
    console.log(err);
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(500)
      .json({
        statsCode: 500,
        data: null,
        error: err,
        message: "Something went wrong",
      });
  }
});

module.exports = router;
