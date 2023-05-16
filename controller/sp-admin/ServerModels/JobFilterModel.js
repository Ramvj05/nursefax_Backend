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
      var Datas = await PostJobTable.find({
        $or: [
          { name: new RegExp(".*" + data.name + ".*", "i") },
          { last_name: new RegExp(".*" + data.last_name + ".*", "i") },
          { email: new RegExp(".*" + data.last_name + ".*", "i") },
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
};
