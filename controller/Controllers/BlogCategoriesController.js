const BlogCategoriesModel = require("../sp-admin/ServerModels/BlogsCategoriesModel");
const jwt = require("jsonwebtoken");
const Auth = require("../../Helpers/Auth");
const authorizer = require("../../middleware/authorizer");

const getBlogCategoriesData = async (req, res, next) => {
  if (await Auth.authorizer(req, res, next)) {
    var data = await BlogCategoriesModel.getBlogCategoriesData(req, res);
    res.status(data.statusCode).send(data);
  }
};
const getBlogCategoriesAllData = async (req, res, next) => {
  // if ( Auth.authorizer(req, res,next)) {
  var data = await BlogCategoriesModel.getBlogCategoriesAllData(req, res);
  res.status(data.statusCode).send(data);
  // }
  // else {
  //     res.status(400).send({ msg: "invalid sessions" });
  // }
};

const saveBlogCategories = async (req, res, next) => {
  if (Auth.authorizer(req, res, next)) {
    var data = await BlogCategoriesModel.saveBlogCategories(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const updateBlogCategories = async (req, res, next) => {
  if (Auth.authorizer(req, res)) {
    var data = await BlogCategoriesModel.updateBlogCategories(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};
const deleteBlogCategories = async (req, res, next) => {
  if (Auth.authorizer(req, res)) {
    var data = await BlogCategoriesModel.deleteBlogCategories(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

const deleteBlogCategoriesImg = async (req, res, next) => {
  if (Auth.authorizer(req, res, next)) {
    var data = await BlogCategoriesModel.deleteBlogCategoriesImg(req, res);
    res.status(data.statusCode).send(data);
  } else {
    res.status(400).send({ msg: "invalid sessions" });
  }
};

module.exports = {
  getBlogCategoriesData,
  saveBlogCategories,
  updateBlogCategories,
  deleteBlogCategories,
  deleteBlogCategoriesImg,
  getBlogCategoriesAllData,
};
