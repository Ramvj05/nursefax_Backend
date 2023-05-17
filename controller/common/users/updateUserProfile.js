const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const UserModel = require("../../../model/user.model");

const router = express.Router();

router.put("/update", authorizer, async function (req, res) {
  const { decodeToken } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);

  console.log({ ...req.body?.payload });
  try {
    const dbUser = await UserModel.findOneAndUpdate(
      {
        deleted: false,
        _id: decodeToken.id,
        userType: 2,
      },
      { ...req.body?.payload },
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
