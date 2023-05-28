const WishlistModel = require("../sp-admin/ServerModels/WishlistModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getCourseWishlistData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.getCourseWishlistData(req, res);
    res.status(200).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const getExamWishlistData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.getExamWishlistData(req, res);
    res.status(200).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const getEventWishlistData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.getEventWishlistData(req, res);
    res.status(200).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const getJobWishlistData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.getJobWishlistData(req, res);
    res.status(200).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const getBlogWishlistData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.getBlogWishlistData(req, res);
    res.status(200).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const saveCourseWishlist = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.saveCourseWishlist(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const deleteCourseWishlist = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.deleteCourseWishlist(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getCourseWishlistData,
  getBlogWishlistData,
  getEventWishlistData,
  getExamWishlistData,
  getJobWishlistData,
  saveCourseWishlist,
  deleteCourseWishlist,
};
