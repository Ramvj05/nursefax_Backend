const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const UserModel = require("../../../model/user.model");

const router = express.Router();

router.get("/get-user-profile/:id", async function (req, res) {
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    const dbUser = await UserModel.findOne(
      {
        deleted: false,
        _id: id,
        userType: 2,
      },
      {
        password: 0,
        email: 0,
        mobile: 0,
        country: 0,
        countryCode: 0,
        createdBy: 0,
        createdOn: 0,
        mcc: 0,
        fullName: 0,
        roles: 0,
        userType: 0,
      }
    );

    console.log(dbUser);
    if (dbUser) {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          data: dbUser,
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
          message: "No User Found",
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
