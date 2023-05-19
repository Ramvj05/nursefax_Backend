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
const getDashboardCount = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.getDashboardCount(req, res);
    res.status(data.statusCode).send(data);
  }
  // else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};
const getCandidatelist = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.getCandidatelist(req, res);
    res.status(data.statusCode).send(data);
  }
  // else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};

module.exports = {
  getJobFilterData,
  postJobfilterData,
  getDashboardCount,
  getCandidatelist,
};
