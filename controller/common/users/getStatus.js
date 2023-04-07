const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");

const router = express.Router();

router.get("/get-status", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const uri = dbUri;
  await mongoose.connect(uri);
  console.log("user?.decodeToken?.id", user._id.toString());
  const resData =
    user.userType === "3" || user.userType === 3
      ? {
          mobile: true,
          country: true,
          mobileVerified: true,
          emailVerified: true,
        }
      : {
          mobile: user.mobile ? true : false,
          country: user.country ? (user.country === "" ? false : true) : false,
          mobileVerified: user?.mobileVerified ? true : false,
          emailVerified: user?.emailVerified ? true : false,
          emailAddress: user?.email,
        };
  try {
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(200)
      .send({
        data: resData,
        message: "User status found successfully",
        statsCode: 200,
        error: null,
      });
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
