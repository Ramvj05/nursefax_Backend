const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const UserModel = require("../../../model/user.model");
const { generateHash, generateSalt } = require("../../../utils/encrypt");

const router = express.Router();

router.put("/update-profile/:userId", async function (req, res) {
  const userId = req.params.userId;
  let body = req.body;
  const uri = dbUri;
  await mongoose.connect(uri);

  let salt = generateSalt();
  const hashPassword = generateHash(body.password, salt);
  body = {
    ...body,
    password: hashPassword,
  };

  try {
    const dbUser = await UserModel.findOneAndUpdate(
      {
        deleted: false,
        _id: userId,
        userType: 2,
      },
      { ...body },
      {
        new: true,
      }
    );
    if (dbUser) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: dbUser,
          message: "user update successfully",
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
          message: "User Not Found",
          statsCode: 404,
          error: {
            message: "No data present",
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
