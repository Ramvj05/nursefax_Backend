const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const decrypy = require("../../../utils/decrypt");

const router = express.Router();

router.post("/verify", authorizer, async function (req, res) {
  const uri = dbUri;
  await mongoose.connect(uri);

  const { user } = req.headers.user;
  console.log(user);

  let { password } = req.body;

  let result = decrypy(password, user.password);

  try {
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
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .json({
          statsCode: 200,
          data: true,
          error: null,
          message: "User validate successfully",
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
        statsCode: 500,
        data: null,
        error: err,
        message: "Something went wrong",
      });
  }
});

module.exports = router;
