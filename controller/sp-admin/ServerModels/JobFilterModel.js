const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const PostJobTable = require("../../../model/TableCollections/TablePostJob");
const PostEventTable = require("../../../model/TableCollections/TablePostEvent");
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
          { posttitle: new RegExp(".*" + data.posttitle + ".*", "i") },
          { employername: new RegExp(".*" + data.employername + ".*", "i") },
          { city: new RegExp(".*" + data.city + ".*", "i") },
        ],
        // $and: [
        //   { posttitle: { $regex: data.posttitle } },
        //   { employername: { $regex: data.employername } },
        //   { city: { $regex: data.city } },
        // ],
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
          {
            employmenttype: new RegExp(".*" + data.employmenttype + ".*", "i"),
          },
        ],
        // $and: [
        //   { employmenttype: { $regex: data.employmenttype } },
        // ],
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
async function getDashboardCount(req, res) {
  //console.log("req",req);
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof req.params.id !== "undefined") {
        const createdBy = req.params.id;
        var data = await PostJobTable.find({
          is_delete: false,
          $or: [{ createdBy: createdBy }, { assignto: createdBy }],
        }).then(
          (response) => {
            var count = response.length;
            console.log("response: ", count);
            resultSet = {
              msg: "success",
              list: count,
              statusCode: 200,
            };
          },
          (err) => {
            // console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500 };
          }
        );
      } else if (typeof req.params.emp_id !== "undefined") {
        const createdBy = req.params.emp_id;
        var data = await PostEventTable.find({
          is_delete: false,
          $or: [{ createdBy: createdBy }, { assignto: createdBy }],
        }).then(
          (response) => {
            // console.log("response: ", response.length);
            var count = response.length;

            resultSet = {
              msg: "success",
              list: count,
              statusCode: 200,
            };
          },
          (err) => {
            // console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500 };
          }
        );
      } else {
        // var counts= await PostJobViewTable.find({blog_id:_id}).count()
        var data = await PostJobTable.aggregate([
          {
            $match: {
              is_delete: false,
            },
          },
        ]).then(
          (response) => {
            // console.log("response: " + response);
            resultSet = {
              msg: "success",
              list: response,
              statusCode: 200,
            };
          },
          (err) => {
            // console.log("err: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
          }
        );
      }

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
async function getCandidatelist(req, res) {
  console.log("req", req.params.empl_id);
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof req.params.empl_id !== "undefined") {
        const createdBy = new mongoose.Types.ObjectId(req.params.empl_id);
        var data = await PostJobTable.aggregate([
          {
            $match: {
              is_delete: false,
              $or: [{ createdBy: createdBy }, { assignto: createdBy }],
            },
          },
          {
            $lookup: {
              from: "applyjobs",
              localField: "_id",
              foreignField: "job_id",
              as: "job_details",
            },
          },
          {
            $unwind: {
              path: "$job_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "job_details.createdBy",
              foreignField: "_id",
              as: "userdetails",
            },
          },
          {
            $unwind: {
              path: "$userdetails",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]).then(
          (response) => {
            resultSet = {
              msg: "success",
              list: response,
              statusCode: 200,
            };
          },
          (err) => {
            console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500 };
          }
        );
      } else {
        // var counts= await PostJobViewTable.find({blog_id:_id}).count()
        var data = await PostJobTable.aggregate([
          {
            $match: {
              is_delete: false,
            },
          },
        ]).then(
          (response) => {
            // console.log("response: " + response);
            resultSet = {
              msg: "success",
              list: response,
              statusCode: 200,
            };
          },
          (err) => {
            // console.log("err: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
          }
        );
      }

      return resultSet;
    } catch (Error) {
      console.log("error: " + Error);
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
  getDashboardCount,
  getCandidatelist,
};
