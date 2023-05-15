const PostEventModel = require("../sp-admin/ServerModels/PostEventModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getPostEventData = async (req, res, next) => {
  // if (await Auth.authorizer(req, res, next)) {
  var data = await PostEventModel.getPostEventData(req, res);
  // console.log(data)
  res.status(data.statusCode).send(data);
  // } else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};
const getEmployeeEventData = async (req, res, next) => {
  // if (await Auth.authorizer(req, res, next)) {
  var data = await PostEventModel.getEmployeeEventData(req, res);
  // console.log(data)
  res.status(data.statusCode).send(data);
  // } else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};
const getPostEventDateData = async (req, res, next) => {
  // if (await Auth.authorizer(req, res, next)) {
  var data = await PostEventModel.getPostEventDateData(req, res);
  // console.log(data)
  res.status(data.statusCode).send(data);
  // } else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};
const savePostEvent = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await PostEventModel.savePostEvent(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const updatePostEvent = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.updatePostEvent(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const deletePostEvent = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.deletePostEvent(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const deletePostEventDelete = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.deletePostEventDelete(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const savePostEventApplyEvent = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.savePostEventApplyEvent(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const savePostEventdate = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await PostEventModel.savePostEventdate(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getPostEventData,
  savePostEvent,
  updatePostEvent,
  deletePostEvent,
  savePostEventdate,
  deletePostEventDelete,
  getPostEventDateData,
  getEmployeeEventData,
  savePostEventApplyEvent,
};
