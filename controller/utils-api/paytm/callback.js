const express = require("express");
const https = require("https");
const { default: axios } = require("axios");

const PaytmChecksum = require("./config/cheksum");
const PaytmConfig = require("./config/config");
const endpoints = require("../../../endpoints/endpoints");

const router = express.Router();

router.post("/callback/:id", async function (req, res) {
  let data = req.body;
  const paramId = req.params.id;
  let userId = paramId.slice(0, 24);
  let courseId = paramId.slice(24, 48);
  let courseType = "nan";
  console.log(req.params);
  console.log(data);

  data = JSON.parse(JSON.stringify(data));

  const paytmChecksum = data.CHECKSUMHASH;

  var isVerifySignature = PaytmChecksum.verifySignature(
    data,
    PaytmConfig.PaytmConfig.key,
    paytmChecksum
  );
  if (isVerifySignature) {
    console.log("Checksum Matched");

    var paytmParams = {};

    paytmParams.body = {
      mid: PaytmConfig.PaytmConfig.mid,
      orderId: data.ORDERID,
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
        path: "/v3/order/status",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      // Set up the request
      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });

        post_res.on("end", function () {
          console.log("Response: ", response);
          const newR = JSON.parse(response);
          console.log("newR", newR);
          if (
            newR?.body?.resultInfo?.resultCode === 01 ||
            newR?.body?.resultInfo?.resultCode === 1 ||
            newR?.body?.resultInfo?.resultCode === "01" ||
            newR?.body?.resultInfo?.resultCode === "1"
          ) {
            axios
              .post(endpoints.license.buy, {
                courseId: courseId,
                type: courseType,
                paymentStatus: "SUCCESS",
                paidAmount: newR?.body?.txnAmount || "0.001",
                paymentMethod: {
                  platform: "PAYTM",
                  source: newR?.body?.gatewayName,
                  paymentMode: newR?.body?.paymentMode,
                },
                paymentDetails: {
                  ...newR?.body,
                  result: newR,
                },
                orderId: newR?.body?.orderId,
                userId: userId,
              })
              .then((ressponse) => {
                console.log("if res ---", ressponse);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(
                  `<html>
                        <head>
                            <title>Show Payment Page</title>
                            <script language=javascript>
                                function redirect(){
                                    setTimeout(() => {
                                        window.location = "${endpoints.userHost}dashboard/my-learning";
                                    },3000)
                                }
                            </script>
                        </head>
                        <body onload="redirect()">
                            <center>
                                <h1>Please do not refresh this page...</h1>
                                <h1>Payment Successfull</h1>
                            </center>
                        </body>
                    </html>`
                );
                res.end();
              })
              .catch((errorr) => {
                console.log("if error ---", errorr);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(
                  `<html>
                        <head>
                            <title>Show Payment Page</title>
                            <script language=javascript>
                                function redirect(){
                                    setTimeout(() => {
                                        window.location = "${endpoints.userHost}courses/details/${courseId}";
                                    },3000)
                                }
                            </script>
                        </head>
                        <body onload="redirect()">
                            <center>
                                <h1>Please do not refresh this page...</h1>
                                <h1>Payment Successfull</h1>
                            </center>
                        </body>
                    </html>`
                );
                res.end();
              });
          } else {
            axios
              .post(endpoints.license.buy, {
                courseId: courseId,
                type: courseType,
                paymentStatus: "ERROR",
                paidAmount: newR?.body?.txnAmount || "0.001",
                paymentMethod: {
                  platform: "PAYTM",
                  source: newR?.body?.gatewayName,
                  paymentMode: newR?.body?.paymentMode,
                },
                paymentDetails: {
                  ...newR?.body,
                  result: newR,
                },
                orderId: newR?.body?.orderId,
                userId: userId,
              })
              .then((ressponse) => {
                console.log("else res ---", ressponse);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(
                  `<html>
                        <head>
                            <title>Show Payment Page</title>
                            <script language=javascript>
                                function redirect(){
                                    setTimeout(() => {
                                        window.location = "${endpoints.userHost}courses/details/${courseId}";
                                    },3000)
                                }
                            </script>
                        </head>
                        <body onload="redirect()">
                            <center>
                                <h1>Please do not refresh this page...</h1>
                                <h1>Payment Successfull</h1>
                            </center>
                        </body>
                    </html>`
                );
                res.end();
              })
              .catch((errorr) => {
                console.log("ele error ---", errorr);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(
                  `<html>
                        <head>
                            <title>Show Payment Page</title>
                            <script language=javascript>
                                function redirect(){
                                    setTimeout(() => {
                                        window.location = "${endpoints.userHost}courses/details/${courseId}";
                                    },3000)
                                }
                            </script>
                        </head>
                        <body onload="redirect()">
                            <center>
                                <h1>Please do not refresh this page...</h1>
                                <h1>Payment Successfull</h1>
                            </center>
                        </body>
                    </html>`
                );
                res.end();
              });
          }
        });
      });

      // post the data
      post_req.write(post_data);
      post_req.end();
    });
  } else {
    console.log("Checksum Mismatched");
  }
});

module.exports = router;
