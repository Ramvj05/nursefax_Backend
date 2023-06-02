const Related = require("../sp-admin/ServerModels/BannerModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getBanner = async (req, res, next) => {
  var data = await Related.getBanner(req, res);
  res.status(data.statusCode).send(data);
};

const saveBanner = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await Related.saveBanner(req, res);
    res.status(data.statusCode).send(data);
  }
};
const deleteBanner = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await Related.deleteBanner(req, res);
    res.status(data.statusCode).send(data);
  }
};
const updateBanner = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await Related.updateBanner(req, res);
    res.status(data.statusCode).send(data);
  }
};

module.exports = {
  getBanner,
  updateBanner,
  deleteBanner,
  saveBanner,
};
