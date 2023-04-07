const express = require("express");

const router = express.Router();

var ElasticEmail = require("@elasticemail/elasticemail-client");
const { default: axios } = require("axios");
const endpoints = require("../../../endpoints/endpoints");
const { dbUri } = require("../../../endpoints/endpoints");
const { default: mongoose } = require("mongoose");
const userModel = require("../../../model/user.model");
var defaultClient = ElasticEmail.ApiClient.instance;

var apikey = defaultClient.authentications["apikey"];

apikey.apiKey =
  "451919C3C5CC33D2F1A86F167943B84CA768437AA96B79D75A2034072640B8CE5A30CA5A4E17A64C0736FA02C8BC800E";

router.get("/send/:userId", async function (req, res) {
  try {
    const { userId } = req.params;

    let emailsApi = new ElasticEmail.EmailsApi();

    const uri = dbUri;
    await mongoose.connect(uri);

    const sendOtpEmail = (result) => {
      const emailData = {
        Recipients: {
          To: [result?.email],
        },
        Content: {
          Body: [
            {
              ContentType: "HTML",
              Charset: "utf-8",
              Content: `<html dir="ltr" lang="en" class="focus-outline-visible" lazy-loaded="true" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
							<meta charset="utf-8"> <!-- utf-8 works for most cases -->
							<meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
							<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
							<meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
							<title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
						
							<link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet">
						
							<!-- CSS Reset : BEGIN -->
						
						
						</head>
						
						<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
							<center style="width: 100%; background-color: #f1f1f1;">
							<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
								<div style="margin:50px auto;width:70%;padding:20px 0">
									<div style="border-bottom:1px solid #eee">
									<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">nursefax.com</a>
									</div>
									<p style="font-size:1.1em">Hi, ${result?.email}</p>
									<p>Thank you for choosing Nursefax.<br/> Click the following link to verify your email.</p>
									<a style="background: #00466a;margin: 0 auto;width: max-content;padding: 5px 10px;color: #fff;border-radius: 4px;" href="${endpoints.userHost}auth/verify/${result?._id}">Activate Your Account</a>
									<p style="font-size:0.9em;">Regards,<br />Nursefax.com</p>
									<hr style="border:none;border-top:1px solid #eee" />
									
								</div>
								</div>
						  </center>
						</body>
					</html>`,
            },
          ],
          From: "Nursefax Support <info@nursefax.com>",
          EnvelopeFrom: "Nursefax Support <info@nursefax.com>",
          ReplyTo: "Nursefax Support <info@nursefax.com>",
          Subject: "Nursefax Account Verification Support",
        },
      };
      const callback = async (error, data, response) => {
        if (error) {
          console.error(error);
          res.status(500).send({
            statsCode: 500,
            data: null,
            message: "Somthing went wrong",
            error: error,
          });
        } else {
          console.log("API called successfully.");
          console.log("Email sent.");
          res.status(200).send({
            statsCode: 200,
            data,
            message: "Mail sent successfully",
            error: null,
          });
        }
      };
      emailsApi.emailsTransactionalPost(emailData, callback);
    };

    const result = await userModel.findOne({
      _id: userId,
    });
    if (result) {
      sendOtpEmail(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      statsCode: 500,
      data: null,
      message: "Somthing went wrong",
      error: err,
    });
  }
});

module.exports = router;
