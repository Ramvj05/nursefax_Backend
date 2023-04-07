const express = require("express");
const PaytmChecksum = require("paytmchecksum");
const https = require("https");
const authorizer = require("../../middleware/authorizer");
const { default: axios } = require("axios");

const router = express.Router();

router.post("/paytm", authorizer, async function (req, res) {
  try {
    var paytmParams = {};

    const { orderId, txnAmount, userInfo } = req.body;

    const merchantKey = "gyoUkqKqSczow%du";
    const merchantId = "EQQsZP13272943466113";

    paytmParams.body = {
      requestType: "Payment",
      mid: merchantId,
      websiteName: "DEFAULT",
      orderId: orderId,
      callbackUrl: "http://localhost:4000/api/utils/paytm/callback",
      txnAmount: txnAmount,
      userInfo: userInfo,
      redirect: false,
    };
    console.log("paytmParams.body------>", paytmParams.body);
    PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      merchantKey
    ).then(async function (checksum) {
      console.log("checksum--->", checksum);
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data: {
            checksum,
          },
          message: "Something went wrong",
        });
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
