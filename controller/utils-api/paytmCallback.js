const express = require("express");
const PaytmChecksum = require("paytmchecksum");
const https = require("https");
const { default: axios } = require("axios");

const router = express.Router();

router.post("/paytm/callback", async function (req, res) {
  console.log("paytm callback", req.body);
  try {
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(200)
      .send({
        statsCode: 200,
        data: {
          success: true,
        },
        message: "Something went wrong",
      });
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
        message: "Something went wrong",
        error: err,
      });
  }
});

module.exports = router;
