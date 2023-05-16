const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const PostJobTable = require("../../../model/TableCollections/TablePostJob");
const FileHandler = require("../../../Helpers/FileHandler");

async function getJobFilterData(req, res) {
  //console.log("req",req);
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const data = req.body;
      //   console.log(data, "datadata");
      var Datas = await PostJobTable.find({
        is_delete: false,
        $and: [
          { posttitle: { $regex: data.posttitle } },
          { employername: { $regex: data.employername } },
          { city: { $regex: data.city } },
        ],
      }).then(
        (response) => {
          // console.log("response: ", response);
          resultSet = { msg: "success", list: response, statusCode: 200 };
        },
        (err) => {
          // console.log("err: ", err);
          resultSet = { msg: err.message, statusCode: 500 };
        }
      );
      return resultSet;
    } catch (Error) {
      // console.log("error: " + Error);
      resultSet = {
        msg: Error,
        statusCode: 501,
      };
      return resultSet;
    }
  } else {
    resultSet = {
      msg: "No direct Access Allowed",
      statusCode: 500,
    };
    return resultSet;
  }
}
async function postJobfilterData(req, res) {
  //console.log("req",req);
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const data = req.body;

      var Datas = await PostJobTable.find({
        is_delete: false,
        $and: [
          { employmenttype: { $regex: data.employmenttype } },
          //   { employername: { $regex: data.employername } },
        ],
      }).then(
        (response) => {
          // console.log("response: ", response);
          resultSet = { msg: "success", list: response, statusCode: 200 };
        },
        (err) => {
          // console.log("err: ", err);
          resultSet = { msg: err.message, statusCode: 500 };
        }
      );
      return resultSet;
    } catch (Error) {
      // console.log("error: " + Error);
      resultSet = {
        msg: Error,
        statusCode: 501,
      };
      return resultSet;
    }
  } else {
    resultSet = {
      msg: "No direct Access Allowed",
      statusCode: 500,
    };
    return resultSet;
  }
}
module.exports = {
  getJobFilterData,
  postJobfilterData,
};
