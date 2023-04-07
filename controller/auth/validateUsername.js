const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../endpoints/endpoints");
const User = require("../../model/user.model");
const CourseAdminModel = require("../../model/courseAdmin.model");

const router = express.Router();

router.post("/validate-username", async function (req, res) {
  try {
    const uri = dbUri;
    // console.log(uri)
    await mongoose.connect(uri);
    const { userName, userType } = req.body;
    let user = null;
    if (userType === 1) {
      user = await CourseAdminModel.findOne(
        {
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
        },
        { password: 0 }
      );
    } else {
      user = await User.findOne(
        {
          deleted: false,
          email: userName,
        },
        { password: 0 }
      );
    }

    if (user) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .json({
          statusCode: 200,
          data: {
            _id: user?._id,
            user: true,
            name: user?.fullName || false,
            firstName: user?.firstName || false,
            lastName: user?.lastName || false,
            picture: user?.picture || "",
            email: user?.email || "",
            emailVerified: user?.emailVerified,
            mobileVerified: user?.mobileVerified,
            active: user?.active,
          },
          error: null,
          message: "User registered.",
        });
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .json({
          statusCode: 200,
          data: {
            user: false,
            ative: false,
          },
          error: null,
          message: "User not registered with us.",
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
      .json({
        statusCode: 500,
        data: null,
        error: err,
        message: "Something went wrong",
      });
  }
});

module.exports = router;
