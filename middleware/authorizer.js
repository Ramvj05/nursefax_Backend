const jwt = require("jsonwebtoken");
const mongooes = require("mongoose");
const { dbUri } = require("../endpoints/endpoints");
const CourseAdminModel = require("../model/courseAdmin.model");
const User = require("../model/user.model");

const authorizer = async (req, res, next) => {
  // await mongooes.disconnect(dbUri, { dbName: "jobs" });
  await mongooes.connect(dbUri);

  const { authorization } = req.headers;
  if (authorization) {
    // console.log(authorization,"authorization")
    const token = authorization.split(' ')[0] != "Bearer" ? authorization.split(' ')[0]:authorization.split(' ')[1]
    const decodeToken = jwt.verify(token,process.env.KEY_FOR_AUTH);
    let data = null;
    if (decodeToken?.userType === 1) {
      data = await CourseAdminModel.findOne({
        deleted: false,
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
      next();
      return
    } else {
      res
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
    return
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
      // return
  }
};

module.exports = authorizer;
