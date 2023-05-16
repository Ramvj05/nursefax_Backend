const PostEventModel = require("../sp-admin/ServerModels/JobFilterModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getJobFilterData = async (req, res, next) => {
  var data = await PostEventModel.getJobFilterData(req, res);
  res.status(data.statusCode).send(data);
};

const postJobfilterData = async (req, res, next) => {
  var data = await PostEventModel.postJobfilterData(req, res);
  res.status(data.statusCode).send(data);
};

module.exports = {
  getJobFilterData,
  postJobfilterData,
};
