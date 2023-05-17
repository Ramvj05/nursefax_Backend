const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { dbUri, EmployerHost } = require("../../endpoints/endpoints");
const User = require("../../model/user.model");
const Employer = require("../../model/TableCollections/TableEmployers");
const { generateSalt, generateHash } = require("../../utils/encrypt");
const { default: axios } = require("axios");
// const EmployerHost = "http://localhost:5000/";
const router = express.Router();
var geoip = require("geoip-lite");

router.post("/employer/linkedin", async function (req, res) {
  try {
    const uri = dbUri;
    await mongoose.connect(uri);

    const code = req.body.code;
    console.log("iiiiiiiiiiiiiiiiiiiiii");

    // console.log("payload--------", {
    //   grant_type: "authorization_code",
    //   code: code,
    //   client_id: "78gzbb0gcof1iu",
    //   client_secret: "HfP6BHV5z4IMIohL",
    //   redirect_uri: `${EmployerHost}auth/linkedin`,
    // });

    const linkedinResult = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?code=${code}&grant_type=authorization_code&client_id=78gzbb0gcof1iu&client_secret=HfP6BHV5z4IMIohL&redirect_uri=${EmployerHost}auth/linkedin&scope=r_liteprofile%20r_emailaddress`,
      {
        grant_type: "authorization_code",
        code: code,
        client_id: "78gzbb0gcof1iu",
        client_secret: "HfP6BHV5z4IMIohL",
        redirect_uri: `${EmployerHost}auth/linkedin`,
      }
    );
    console.log("linkedinResult", linkedinResult);
    // console.log("bharath",
    // linkedinResult?.data?.access_token)
    axios
      .get(
        "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))",
        {
          headers: {
            Authorization: "Bearer " + linkedinResult?.data?.access_token,
          },
        }
      )
      .then(async (r) => {
        // const userName = name?.toLowerCase()?.split(" ").join("") || "";
        const ip =
          req.headers["x-forwarded-for"]?.split(",").shift() ||
          req.socket?.remoteAddress;
        const location = geoip.lookup(ip);
        // console.log("location", location);
        // const Country = location.country

        const salt = generateSalt();
        const hash = generateHash(salt);

        let norUser = await Employer.findOne(
          {
            $or: [
              {
                email: r.data.elements[0]["handle~"]["emailAddress"],
              },
            ],
            $and: [
              {
                is_delete: false,
              },
            ],
          },
          { password: 0 }
        );

        const getToken = (user) => {
          return jwt.sign(
            {
              email: user.email,
              userName: user.userName,
              // UserCountry:user.UserCountry,
              id: user._id.toString(),
              userType: user.userType,
              avatarUrl: user?.user || user?.profileUri || "",
            },
            "nursefax.com",
            { expiresIn: "6h" }
          );
        };

        if (norUser && norUser.userType === 4) {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .json({
              statsCode: 200,
              data: getToken(norUser),
              error: null,
              message: "User logged in successfully",
            });
        } else {
          const newUser = new Employer({
            // userName: userName,
            email: r.data.elements[0]["handle~"]["emailAddress"],
            // firstName: given_name,
            // lastName: family_name,
            password: hash,
            // UserCountry:Country,
            // picture,
            userType: 4,
            roles: ["EMPLOYER"],
            emailVerified: true,
          });
          const userData = await newUser.save();
          // console.log(userData);
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .json({
              statsCode: 200,
              data: getToken(userData),
              error: null,
              message: "User logged in successfully",
            });
        }
      })
      .catch((err) => {
        console.log("fffffffffffffffffffffffffff", err);
      });

    if (linkedinResult?.data?.access_token) {
      try {
        // console.log("emailResult---", emailResult?.data);
      } catch (error) {
        // console.log("eror-----", error);
      }
    }
  } catch (err) {
    console.log(err, "llllllllllllllllllllllll");
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
