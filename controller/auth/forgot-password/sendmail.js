const express = require("express");

const router = express.Router();

var ElasticEmail = require("@elasticemail/elasticemail-client");
const { default: axios } = require("axios");
const endpoints = require("../../../endpoints/endpoints");
const { dbUri } = require("../../../endpoints/endpoints");
const { default: mongoose } = require("mongoose");
const userModel = require("../../../model/user.model");
const otpModel = require("../../../model/otp.model");
const courseAdminModel = require("../../../model/courseAdmin.model");
const employerModel = require("../../../model/TableCollections/TableEmployers");
var defaultClient = ElasticEmail.ApiClient.instance;

var apikey = defaultClient.authentications["apikey"];
apikey.apiKey =
  "451919C3C5CC33D2F1A86F167943B84CA768437AA96B79D75A2034072640B8CE5A30CA5A4E17A64C0736FA02C8BC800E";

router.get("/mail/:email", async function (req, res) {
  // res.header({
  // 	"Content-Type": "application/json",
  // 	"Access-Control-Allow-Origin": "*",
  // });
  // const uri = dbUri;
  // await mongoose.connect(uri);
  // try {
  // 	var ses = new AWS.SES({
  // 		region: "ap-southeast-1",
  // 	});
  // 	const { email } = req.params;

  // 	console.log("Email", email);

  // 	const presentUser = await User.findOne({
  // 		email: email,
  // 	});

  // 	console.log("presentUser", presentUser);

  // 	if (presentUser) {
  // 		const { userName, password, mobile } = presentUser;
  // 		const params = {
  // 			Destination: {
  // 				ToAddresses: [email], // Email address addresses that you want to send your email to
  // 			},
  // 			Message: {
  // 				Body: {
  // 					Html: {
  // 						// HTML Format of the email
  // 						Charset: "UTF-8",
  // 						Data: `<html><body><h2> This mail is from NurseFax.com </h2></br> <h4>You have requested for forgot password </h4> </br> <p>UserName : ${userName} </p> </br> <p>Password : ${password}</p></br> <p>Mobile : ${mobile}</p> </br> <p>Email : ${email}</p></h4></body></html>`,
  // 					},
  // 					Text: {
  // 						Charset: "UTF-8",
  // 						Data: "FYI",
  // 					},
  // 				},
  // 				Subject: {
  // 					Charset: "UTF-8",
  // 					Data: "Email via SES",
  // 				},
  // 			},
  // 			Source: "98mukeshparmar@gmail.com",
  // 		};

  // 		const mailRes = await ses.sendEmail(params).promise();
  // 		if (!mailRes?.MessageId) {
  // 			console.log(err, err.stack);
  // 			if (!res.headerSent) {
  // 				res.status(500).send({
  // 					statsCode: 500,
  // 					data: null,
  // 					message: "Somthing went wrong",
  // 					error: mailRes,
  // 				});
  // 			}
  // 		} else {
  // 			console.log(mailRes);
  // 			if (!res.headerSent) {
  // 				res.status(200).send({
  // 					statsCode: 200,
  // 					data: mailRes,
  // 					message: "Mail sent successfully",
  // 					error: null,
  // 				});
  // 			}
  // 		}
  // 	} else {
  // 		if (!res.headerSent) {
  // 			res.status(404).send({
  // 				statsCode: 404,
  // 				data: null,
  // 				message: "User not found",
  // 				error: err,
  // 			});
  // 		}
  // 	}
  // } catch (err) {
  // 	console.log(err);
  // 	if (!res.headerSent) {
  // 		res.status(500).send({
  // 			statsCode: 500,
  // 			data: null,
  // 			message: "Somthing went wrong",
  // 			error: err,
  // 		});
  // 	}
  // }

  try {
    const { email: useremail } = req.params;

    let emailsApi = new ElasticEmail.EmailsApi();

    const uri = dbUri;
    await mongoose.connect(uri);
    let presentUser;
    const user = await userModel.findOne({
      $or: [
        {
          email: useremail,
        },
      ],
    });
    if (user) {
      presentUser = user;
      console.log("present user", presentUser);
    } else {
      const courseAdmin = await courseAdminModel.findOne({
        $or: [
          {
            email: useremail,
          },
        ],
      });
      if (courseAdmin) {
        presentUser = courseAdmin;
        console.log("present ", presentUser);
      } else {
        presentUser = await employerModel.findOne({
          $or: [
            {
              email: useremail,
            },
          ],
        });
      }
      console.log(" user", presentUser);
    }

    if (presentUser) {
      const otp = await axios.get(endpoints.otp.create + `/${useremail}`);

      const realOtp = otp?.data?.data?.otp;
      const emailData = {
        Recipients: {
          To: [useremail],
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
									<p style="font-size:1.1em">Hi, ${useremail}</p>
									<p>Thank you for choosing Nursefax.<br/> Use the following OTP to complete your Reset Password procedures.<br /> OTP is valid for 10 minutes</p>
									<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${realOtp}</h2>
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
          Subject: "Nursefax Password Reset Support",
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

          await otpModel.findByIdAndUpdate(
            otp.data?.data?._id,
            {
              transactionID: data?.TransactionID,
            },
            { new: true }
          );

          res.status(200).send({
            statsCode: 200,
            data,
            message: "Mail sent successfully",
            error: null,
          });
        }
      };
      emailsApi.emailsTransactionalPost(emailData, callback);
    } else {
      res.status(404).send({
        statsCode: 404,
        data: null,
        message: "No user found",
        error: {},
      });
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
