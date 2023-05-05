const express = require("express");
const https = require("https");
const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");

const PaytmChecksum = require("./config/cheksum");
const PaytmConfig = require("./config/config");
const endpoints = require("../../../endpoints/endpoints");

const router = express.Router();

router.post("/pay", async function (req, res) {
  const orderId = uuidv4();
  let data = req.body;
  const paytmParams = {};
  console.log(data, "ooooooooooooooooooooooooooooooooo");
  paytmParams.body = {
    requestType: "Payment",
    mid: PaytmConfig.PaytmConfig.mid,
    websiteName: PaytmConfig.PaytmConfig.website,
    orderId: orderId,
    callbackUrl: `${endpoints.host}/utils/paytm/callback/${data.userId}${data.courseId}`,
    txnAmount: {
      value: data.amount,
      currency: "INR",
    },
    userInfo: {
      custId: data.userId,
    },
    redirect: false,
  };

  PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    PaytmConfig.PaytmConfig.key
  ).then(function (checksum) {
    paytmParams.head = {
      signature: checksum,
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {
      hostname: "securegw.paytm.in",
      port: 443,
      path: `/theia/api/v1/initiateTransaction?mid=${PaytmConfig.PaytmConfig.mid}&orderId=${orderId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    var response = "";
    var post_req = https.request(options, function (post_res) {
      post_res.on("data", function (chunk) {
        response += chunk;
      });

      post_res.on("end", function () {
        response = JSON.parse(response);
        console.log("txnToken:", response);
        res
          .header({
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200).send(`
            <html>
              <head>
                <title>Show Payment Page</title>
              </head>
              <body>
                  <center>
                    <h1>Please do not refresh this page...</h1>
                  </center>
                  <form method="post" action="https://securegw.paytm.in/theia/api/v1/showPaymentPage?mid=${PaytmConfig.PaytmConfig.mid}&orderId=${orderId}" name="paytm">
                    <table border="1">
                      <tbody>
                        <input type="hidden" name="mid" value="${PaytmConfig.PaytmConfig.mid}">
                        <input type="hidden" name="orderId" value="${orderId}">
                        <input type="hidden" name="txnToken" value="${response.body.txnToken}">
                      </tbody>
                    </table>
                    <script type="text/javascript"> document.paytm.submit(); </script>
                </form>
              </body>
            </html>
          `);
        // res.end();
      });
    });

    post_req.write(post_data);
    post_req.end();
  });
});

module.exports = router;
