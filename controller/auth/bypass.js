const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { dbUri } = require("../../endpoints/endpoints");
const User = require("../../model/user.model");
const { generateSalt, generateHash } = require("../../utils/encrypt");

const router = express.Router();

router.post("/bypass", async function (req, res) {
  try {
    const uri = dbUri;
    await mongoose.connect(uri);

    const token = jwt.decode(req.body.id_token);
    console.log(token);
    const { email, given_name, family_name, name, sub, picture } = token;

    const userName = name?.toLowerCase()?.split(" ").join("") || "";

    const salt = generateSalt();
    const hash = generateHash(sub, salt);
    let norUser = await User.findOne(
      {
        $or: [
          {
            userName: userName,
          },
          {
            email: email,
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
          userName: user.userName,
          id: user._id.toString(),
          userType: user.userType,
          avatarUrl: user?.picture || user?.profileUri || "",
        },
        "nursefax.com",
        { expiresIn: "6h" }
      );
    };

    console.log(norUser);
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
        userName: userName,
        email: email,
        firstName: given_name,
        lastName: family_name,
        password: hash,
        picture,
        userType: 2,
        roles: ["STUDENT"],
        emailVerified: true,
      });
      const userData = await newUser.save();
      console.log(userData);
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
