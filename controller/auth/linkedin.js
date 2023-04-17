const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { dbUri } = require("../../endpoints/endpoints");
const User = require("../../model/user.model");
const { generateSalt, generateHash } = require("../../utils/encrypt");
const { default: axios } = require("axios");
const hosturi="http://localhost:3000/"
const router = express.Router();
var geoip = require('geoip-lite');

router.post("/linkedin", async function (req, res) {
  try {
    const uri = dbUri;
    await mongoose.connect(uri);

    const code = req.body.code;
    // console.log(code);

    // console.log("payload--------", {
    //   grant_type: "authorization_code",
    //   code: code,
    //   client_id: "78gzbb0gcof1iu",
    //   client_secret: "HfP6BHV5z4IMIohL",
    //   redirect_uri: `${hosturi}auth/linkedin`,
    // });

    const linkedinResult = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?code=${code}&grant_type=authorization_code&client_id=78gzbb0gcof1iu&client_secret=HfP6BHV5z4IMIohL&redirect_uri=${hosturi}auth/linkedin&scope=r_liteprofile%20r_emailaddress`,
      {
        grant_type: "authorization_code",
        code: code,
        client_id: "78gzbb0gcof1iu",
        client_secret: "HfP6BHV5z4IMIohL",
        redirect_uri: `${hosturi}auth/linkedin`,
      }
    );
    // console.log("linkedinResult", linkedinResult?.data?.access_token);
    // console.log("bharath",
    // linkedinResult?.data?.access_token)
    axios.get(
      "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))",
      {
        headers: {
          Authorization: "Bearer " + linkedinResult?.data?.access_token,
        },
      }
    ).then(async(r)=>{
      console.log("r",r.data)
      // const userName = name?.toLowerCase()?.split(" ").join("") || "";
      const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress
      const location = geoip.lookup(ip)
      // const Country = location.country

      const salt = generateSalt();
      const hash = generateHash(salt);
  
      let norUser = await User.findOne(
        {
          $or: [
            {
              email: r.data.elements[0]['handle~']['emailAddress'],
            },
          ],
          $and: [
            {
              deleted: false,
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
            avatarUrl: user?.picture || user?.profileUri || "",
          },
          "nursefax.com",
          { expiresIn: "6h" }
        );
      };
  
      // console.log(norUser,"oooooooooooooooooooooooooooo");
      if (norUser && norUser.userType === 2) {
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
        const newUser = new User({
          // userName: userName,
          email: r.data.elements[0]['handle~']['emailAddress'],
          // firstName: given_name,
          // lastName: family_name,
          password: hash,
          UserCountry:Country,
          // picture,
          userType: 2,
          roles: ["STUDENT"],
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
    }).catch(err=>{
       
      console.log("err",err)
    })
  
    if (
      linkedinResult?.data?.access_token
    ) {
      try {
        
        // console.log("emailResult---", emailResult?.data);
      } catch (error) {
        // console.log("eror-----", error);
      }
    }

   

  
  } catch (err) {
    // console.log(err);
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