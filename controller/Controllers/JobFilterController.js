const PostEventModel = require("../sp-admin/ServerModels/JobFilterModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getJobFilterData = async (req, res, next) => {
  //   if (await Auth.authorizer(req, res, next)) {
  var data = await PostEventModel.getJobFilterData(req, res);
  // console.log(data)
  res.status(data.statusCode).send(data);
  //   } else {
  //     res.status(400).send({ msg: "invalid sessions" });
  //   }
};

const saveJobFilter = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await PostEventModel.saveJobFilter(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const updateJobFilter = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.updateJobFilter(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const deleteJobFilter = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.deleteJobFilter(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getJobFilterData,
  saveJobFilter,
  updateJobFilter,
  deleteJobFilter,
};
