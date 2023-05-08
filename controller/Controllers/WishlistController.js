const WishlistModel = require("../sp-admin/ServerModels/WishlistModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getWishlistData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.getWishlistData(req, res);
    res.status(200).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const saveWishlist = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.saveWishlist(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const updateWishlist = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.updateWishlist(req, res, res);
    console.log(data, "lllllllllllllll");
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const deleteWishlist = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await WishlistModel.deleteWishlist(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getWishlistData,
  saveWishlist,
  updateWishlist,
  deleteWishlist,
};
