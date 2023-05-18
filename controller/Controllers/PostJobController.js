const PostJobModel = require("../sp-admin/ServerModels/PostJobModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getPostJobData = async (req, res, next) => {
  // if (Auth.authorizer(req, res, next)) {
  var data = await PostJobModel.getPostJobData(req, res);
  res.status(data.statusCode).send(data);
  // } else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};
const getEmployerJobData = async (req, res, next) => {
  if (Auth.authorizer(req, res, next)) {
    var data = await PostJobModel.getEmployerJobData(req, res);
    res.status(data.statusCode).send(data);
  }
  // else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};

const savePostJob = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await PostJobModel.savePostJob(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const saveApplyJob = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await PostJobModel.saveApplyJob(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const updatePostJob = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostJobModel.updatePostJob(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const updateJobStatus = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostJobModel.updateJobStatus(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const getDownloaded = async (req, res, next) => {
  // if (await Auth.authorizer(req, res)) {
  var data = await PostJobModel.getDownloaded(req, res);
  ///res.status(data.statusCode).send(data);
  // } else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};
const deletePostJob = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostJobModel.deletePostJob(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getPostJobData,
  savePostJob,
  updatePostJob,
  deletePostJob,
  updateJobStatus,
  saveApplyJob,
  getEmployerJobData,
  getDownloaded,
};
