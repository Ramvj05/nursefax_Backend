const Related = require("../sp-admin/ServerModels/RelatedModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getCourseRealted = async (req, res, next) => {
  var data = await Related.getCourseRealted(req, res);
  res.status(data.statusCode).send(data);
};

const getJobRelated = async (req, res, next) => {
  var data = await Related.getJobRelated(req, res);
  res.status(data.statusCode).send(data);
};
const saveRatings = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await Related.saveRatings(req, res);
    res.status(data.statusCode).send(data);
  }
};
const getRatings = async (req, res, next) => {
  // if (await Auth.authorizer(req, res, next)) {
  var data = await Related.getRatings(req, res);
  res.status(data.statusCode).send(data);
  // }
};
const deleteRatings = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await Related.deleteRatings(req, res);
    res.status(data.statusCode).send(data);
  }
};
const updateRatings = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await Related.updateRatings(req, res);
    res.status(data.statusCode).send(data);
  }
};

module.exports = {
  getCourseRealted,
  updateRatings,
  deleteRatings,
  getRatings,
  saveRatings,
  getJobRelated,
};
