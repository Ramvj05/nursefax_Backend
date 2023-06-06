const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserClass = require("../../../class/user.class");
const { dbUri } = require("../../../endpoints/endpoints");
const UserModel = require("../../../model/user.model");
const otpModel = require("../../../model/otp.model");
const { generateSalt, generateHash } = require("../../../utils/encrypt");
const courseAdminModel = require("../../../model/courseAdmin.model");
const employerModel = require("../../../model/TableCollections/TableEmployers");
const router = express.Router();

router.post("/reset-password", async function (req, res) {
  try {
    let body = req.body;
    const uri = dbUri;
    await mongoose.connect(uri);

    let User;
    if (body.userType == "1") {
      User = courseAdminModel;
    } else if (body.userType == 4) {
      User = employerModel;
    } else {
      User = UserModel;
    }

    let transactionId = body.transactionID;
    delete body.transactionID;

    const newUser = new User(body);

    const presentOtp = await otpModel.findOne({
      $and: [
        {
          email: newUser.email,
        },
        {
          transactionID: transactionId,
        },
      ],
    });

    const presentUser = await User.findOne({
      $or: [
        {
          email: newUser.email,
        },
      ],
    });

    if (presentUser) {
      if (presentOtp) {
        const salt = generateSalt();
        const hash = generateHash(req.body.password, salt);
        await User.findOneAndUpdate(
          {
            $or: [{ deleted: false }, { is_delete: false }],
            _id: presentUser?._id.toString(),
          },
          { password: hash },

          {
            new: true,
          }
        );
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: null,
            message: "Password updated successfully",
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
            statsCode: 404,
            data: null,
            error: { message: "Invalid transaction id" },
            message: "Can`t reset password",
          });
      }
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
          error: { message: "No user found" },
          message: "No user found",
        });
    }
  } catch (err) {
    console.log("error", err);

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
