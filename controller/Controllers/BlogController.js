const BlogsModel = require("../sp-admin/ServerModels/BlogsModel");
var jwt = require("jsonwebtoken");
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth");

const getBlogsData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await BlogsModel.getBlogsData(req, res);
    res.status(data.statusCode).send(data);
  }
  // else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};
const getUserBlogsData = async (req, res, next) => {
  // if (Auth.authorizer(req, res, next)) {
  var data = await BlogsModel.getUserBlogsData(req, res);
  // console.log(data)
  res.status(data.statusCode).send(data);
  // }
};

const saveBlogs = async (req, res, next) => {
  if (Auth.authorizer(req, res, next)) {
    var data = await BlogsModel.saveBlogs(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const saveViewBlogs = async (req, res, next) => {
  // if (Auth.authorizer(req, res, next)) {
  var data = await BlogsModel.saveViewBlogs(req, res);
  res.status(data.statusCode).send(data);
  // } else {
  //   res.status(400).send({ msg: "invalid sessions" });
  // }
};

const updateBlogs = async (req, res, next) => {
  if (Auth.authorizer(req, res)) {
    var data = await BlogsModel.updateBlogs(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const deleteBlogs = async (req, res, next) => {
  if (Auth.authorizer(req, res)) {
    var data = await BlogsModel.deleteBlogs(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const deleteBlogsImg = async (req, res, next) => {
  if (Auth.authorizer(req, res)) {
    var data = await BlogsModel.deleteBlogsImg(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getBlogsData,
  saveBlogs,
  updateBlogs,
  deleteBlogs,
  deleteBlogsImg,
  getUserBlogsData,
  saveViewBlogs,
};
