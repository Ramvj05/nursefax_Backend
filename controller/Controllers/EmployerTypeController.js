const PostEventModel = require("../sp-admin/ServerModels/EmployerTypeModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getEmployerTypeData = async (req, res, next) => {
  // if (await Auth.authorizer(req, res, next)) {
  var data = await PostEventModel.getEmployerTypeData(req, res);
  // console.log(data)
  res.status(data.statusCode).send(data);
  // } else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};

const saveEmployerType = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await PostEventModel.saveEmployerType(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const updateEmployerType = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.updateEmployerType(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const deleteEmployerType = async (req, res, next) => {
  if (await Auth.authorizer(req, res)) {
    var data = await PostEventModel.deleteEmployerType(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getEmployerTypeData,
  saveEmployerType,
  updateEmployerType,
  deleteEmployerType,
};
