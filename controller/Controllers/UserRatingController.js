const UserRatingsModel = require("../sp-admin/ServerModels/UserRatingsModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getUserRatingsData = async (req, res, next) => {
  // if (Auth.Verify(req, res, next)) {
  var data = await UserRatingsModel.getUserRatingsData(req, res);
  // console.log(data)
  res.status(data.statusCode).send(data);
  // }
};

const saveUserRatings = async (req, res, next) => {
  if (Auth.Verify(req, res, next)) {
    var data = await UserRatingsModel.saveUserRatings(req, res);
    res.status(data.statusCode).send(data);
  }
  // else {
  //     res.status(400).send({ msg: "invalid sessions" });
  // }
};

const updateUserRatings = async (req, res, next) => {
  if (Auth.Verify(req, res)) {
    var data = await UserRatingsModel.updateUserRatings(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const deleteUserRatings = async (req, res, next) => {
  if (Auth.Verify(req, res)) {
    var data = await UserRatingsModel.deleteUserRatings(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const deleteUserRatingsImg = async (req, res, next) => {
  if (Auth.Verify(req, res)) {
    var data = await UserRatingsModel.deleteUserRatingsImg(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getUserRatingsData,
  saveUserRatings,
  updateUserRatings,
  deleteUserRatings,
  deleteUserRatingsImg,
};
