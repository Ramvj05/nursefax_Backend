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
      if (typeof req.params.emp_id !== "undefined") {
        const createdBy = req.params.emp_id;
        var data = await PostJobTable.find({
          is_delete: false,
          $or: [{ createdBy: createdBy }, { assignto: createdBy }],
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
      } else if (typeof req.params.job_id !== "undefined") {
        // console.log(req.params.job_id, "req.params.job_id");
        const job_id = new mongoose.Types.ObjectId(req.params.job_id);
        var data = await ApplyJobTable.aggregate([
          {
            $match: {
              job_id,
              is_delete: false,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
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
          // {
          //   $lookup: {
          //     from: "blogcategories",
          //     localField: "PrimaryCategory",
          //     foreignField: "_id",
          //     as: "categordetails"
          //   }
          // },
        ]).then(
          (response) => {
            // console.log("response: ", response);
            resultSet = { msg: "success", list: response, statusCode: 200 };
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
module.exports = {
  getJobFilterData,
};
