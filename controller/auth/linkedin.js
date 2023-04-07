const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { dbUri, userHost } = require("../../endpoints/endpoints");
const User = require("../../model/user.model");
const { generateSalt, generateHash } = require("../../utils/encrypt");
const { default: axios } = require("axios");

const router = express.Router();

router.post("/linkedin", async function (req, res) {
  try {
    const uri = dbUri;
    await mongoose.connect(uri);

    const code = req.body.code;
    console.log(code);

    console.log("payload--------", {
      grant_type: "authorization_code",
      code: code,
      client_id: "78gzbb0gcof1iu",
      client_secret: "HfP6BHV5z4IMIohL",
      redirect_uri: `${userHost}auth/linkedin`,
    });

    const linkedinResult = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?code=${code}&grant_type=authorization_code&client_id=78gzbb0gcof1iu&client_secret=HfP6BHV5z4IMIohL&redirect_uri=${userHost}auth/linkedin`,
      {
        grant_type: "authorization_code",
        code: code,
        client_id: "78gzbb0gcof1iu",
        client_secret: "HfP6BHV5z4IMIohL",
        redirect_uri: `${userHost}auth/linkedin`,
      }
    );
    console.log("linkedinResult", linkedinResult?.data?.access_token);
    if (
      linkedinResult &&
      linkedinResult?.data &&
      linkedinResult?.data?.access_token
    ) {
      try {
        const emailResult = await axios.get(
          "https://api.linkedin.com/v2/userinfo",
          {
            headers: {
              Authorization: "Bearer " + linkedinResult?.data?.access_token,
            },
          }
        );
        console.log("emailResult---", emailResult?.data);
      } catch (error) {
        console.log("eror-----", error);
      }
    }

    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(200)
      .json({
        statsCode: 200,
        data: "",
        error: null,
        message: "User logged in successfully",
      });

    // const userName = name?.toLowerCase()?.split(" ").join("") || "";

    // const salt = generateSalt();
    // const hash = generateHash(sub, salt);

    // let norUser = await User.findOne(
    //   {
    //     $or: [
    //       {
    //         userName: userName,
    //       },
    //       {
    //         email: email,
    //       },
    //     ],
    //     $and: [
    //       {
    //         deleted: false,
    //       },
    //     ],
    //   },
    //   { password: 0 }
    // );

    // const getToken = (user) => {
    //   return jwt.sign(
    //     {
    //       userName: user.userName,
    //       id: user._id.toString(),
    //       userType: user.userType,
    //       avatarUrl: user?.picture || user?.profileUri || "",
    //     },
    //     "nursefax.com",
    //     { expiresIn: "6h" }
    //   );
    // };

    // console.log(norUser);
    // if (norUser && norUser.userType === 2) {
    //   res
    //     .header({
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     })
    //     .status(200)
    //     .json({
    //       statsCode: 200,
    //       data: getToken(norUser),
    //       error: null,
    //       message: "User logged in successfully",
    //     });
    // } else {
    //   const newUser = new User({
    //     userName: userName,
    //     email: email,
    //     firstName: given_name,
    //     lastName: family_name,
    //     password: hash,
    //     picture,
    //     userType: 2,
    //     roles: ["STUDENT"],
    //     emailVerified: true,
    //   });
    //   const userData = await newUser.save();
    //   console.log(userData);
    //   res
    //     .header({
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     })
    //     .status(200)
    //     .json({
    //       statsCode: 200,
    //       data: getToken(userData),
    //       error: null,
    //       message: "User logged in successfully",
    //     });
    // }
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
