require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongooes = require("mongoose");
const { dbUri } = require("../endpoints/endpoints");
const CourseAdminModel = require("../model/courseAdmin.model");
const EmployerModel = require("../model/TableCollections/TableEmployers");
const User = require("../model/user.model");

const authorizer = async (req, res, next) => {
  // await mongooes.disconnect(dbUri, { dbName: "jobs" });
  await mongooes.connect(dbUri);

  const { authorization } = req.headers;
  if (authorization) {
    const token =
      authorization.split(" ")[0] != "Bearer"
        ? authorization.split(" ")[0]
        : authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, process.env.KEY_FOR_AUTH);
    let data = null;
    if (decodeToken?.userType === 1) {
      data = await CourseAdminModel.findOne({
        deleted: false,
        _id: decodeToken?.id,
      });
    } else if (decodeToken?.userType === 4) {
      data = await EmployerModel.findOne({
        is_delete: false,
        _id: decodeToken?.id,
      });
    } else {
      data = await User.findOne(
        {
          deleted: false,
          _id: decodeToken?.id,
        },
        {
          password: 0,
        }
      );
    }

    if (data) {
      req.headers.user = { decodeToken, authorization, user: data };
      return true;
    } else {
      return res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(404)
        .send({
          statusCode: 404,
          data: null,
          message: "User not found",
          err: {
            message: "User not found",
          },
        });
    }
  } else {
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(401)
      .send({
        statusCode: 401,
        data: null,
        message: "Token is in-valid",
        err: {
          message: "Token is required",
        },
      });
    return;
  }
};
const Login = async (req, res, next) => {
  try {
    const { name, email, adminid } = req;
    var userToken = jwt.sign(
      { name: name, email: email, adminid: adminid },
      process.env.KEY_FOR_AUTH,
      { expiresIn: "1d" }
    );
    return userToken;
  } catch (err) {
    if (err) {
      return false;
    }
  }
};
//adminPanel
//admin_panel | best
//Admin
// ADMIN
const Verify = (req, res, next) => {
  var Bearer = req.headers.authorization;
  if (typeof Bearer !== "undefined") {
    var token = Bearer.split(" ");
    var AuthToken = typeof token[1] !== "undefined" ? token[1] : token;
    var DATA = false;
    try {
      jwt.verify(
        AuthToken,
        process.env.KEY_FOR_AUTH,
        function (errJwt, responseJwt) {
          //redis

          if (errJwt) {
            returndata = { msg: "jwt token error", error: errJwt }; //Promise<JWt>
          } else {
            DATA = true;
          }
        }
      );
    } catch (Err) {
      DATA = false;
    }

    console.log(DATA, "JWT");
    return DATA;
  } else {
    return false;
  }
};

module.exports = { Login, Verify, authorizer };
