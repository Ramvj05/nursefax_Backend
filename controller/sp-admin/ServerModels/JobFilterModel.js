const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const PostJobTable = require("../../../model/TableCollections/TablePostJob");
const PostEventTable = require("../../../model/TableCollections/TablePostEvent");
const FileHandler = require("../../../Helpers/FileHandler");
const CronJob = require("cron").CronJob;

async function getJobFilterData(req, res) {
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const data = req.body;
      var posttitle;
      var country;
      var state;
      var speciality;
      var employmenttype;
      const rr = [];
      if (data.posttitle && data.posttitle != "") {
        posttitle = data.posttitle.replace(
          /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
          "\\$&"
        );
        rr.push({
          posttitle: new RegExp(".*" + posttitle + ".*", "si"),
        });
      }
      if (data.posttitle && data.posttitle != "") {
        posttitle = data.posttitle.replace(
          /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
          "\\$&"
        );
        rr.push({
          keyword: new RegExp(".*" + posttitle + ".*", "si"),
        });
      }
      if (data.country && data.country != "") {
        country = data.country.replace(
          /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
          "\\$&"
        );
        rr.push({ country: new RegExp(".*" + country + ".*", "si") });
      }
      if (data.state && data.state != "") {
        state = data.state.replace(
          /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
          "\\$&"
        );
        rr.push({ state: new RegExp(".*" + state + ".*", "si") });
      }
      if (data.speciality && data.speciality != "") {
        speciality = data.speciality.replace(
          /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
          "\\$&"
        );
        rr.push({ speciality: new RegExp(".*" + speciality + ".*", "si") });
      }
      if (data.job_date == "last_three") {
        var d = new Date();
        d.setDate(new Date().getDate() - 3);
      } else if (data.job_date == "last_24") {
        var d = new Date();
        d.setDate(new Date().getDate() - 1);
      } else {
        var d = new Date();
        d.setDate(new Date().getDate() - 7);
      }
      rr.push({
        createdOn: { $lte: new Date() },
        createdOn: { $gte: d },
      });
      console.log(data.employmenttype);
      if (data.employmenttype && data.employmenttype != "") {
        employmenttype = JSON.parse(data.employmenttype).map(
          (e) => new mongoose.Types.ObjectId(e)
        );
        rr.push({ employmenttype: { $in: employmenttype } });
      }

      await PostJobTable.aggregate([
        {
          $match: {
            is_delete: false,
            $or: rr,
          },
        },
        {
          $lookup: {
            from: "postemployertypes",
            localField: "employmenttype",
            foreignField: "_id",
            as: "employment_type",
          },
        },
        {
          $unwind: {
            path: "$employment_type",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "employers",
            localField: "createdBy",
            foreignField: "_id",
            as: "employer_details",
          },
        },
        {
          $unwind: {
            path: "$employer_details",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "employers",
            localField: "assignto",
            foreignField: "_id",
            as: "employer_details1",
          },
        },
        {
          $unwind: {
            path: "$employer_details1",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]).then(
        (response) => {
          resultSet = { msg: "success", list: response, statusCode: 200 };
        },
        (err) => {
          console.log(err);
          resultSet = { msg: err.message, statusCode: 500 };
        }
      );
      return resultSet;
    } catch (Error) {
      console.log(Error);
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
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      let datedata;

      if (req.params.job_date) {
        if (req.params.job_date == "last_three") {
          var d = new Date();
          d.setDate(new Date().getDate() - 3);
        } else if (req.params.job_date == "last24") {
          var d = new Date();
          d.setDate(new Date().getDate() - 1);
        } else {
          d.setDate(new Date().getDate() - 7);
        }

        console.log(d);
        var Datas = await PostJobTable.aggregate([
          {
            $match: {
              is_delete: false,
              $and: [
                {
                  createdOn: { $lte: new Date() },
                  createdOn: {
                    $gte: d,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "employers",
              localField: "createdBy",
              foreignField: "_id",
              as: "employer_details",
            },
          },
          {
            $unwind: {
              path: "$employer_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "employers",
              localField: "assignto",
              foreignField: "_id",
              as: "employer_details1",
            },
          },
          {
            $unwind: {
              path: "$employer_details1",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "postemployertypes",
              localField: "employmenttype",
              foreignField: "_id",
              as: "employment_type",
            },
          },
          {
            $unwind: {
              path: "$employment_type",
              preserveNullAndEmptyArrays: true,
            },
          },
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
        const data = req.body;
        const employmenttype = JSON.parse(data.employmenttype).map(
          (e) => new mongoose.Types.ObjectId(e)
        );
        var Datas = await PostJobTable.aggregate([
          {
            $match: {
              is_delete: false,
              $or: [{ employmenttype: { $in: employmenttype } }],
            },
          },
          {
            $lookup: {
              from: "employers",
              localField: "createdBy",
              foreignField: "_id",
              as: "employer_details",
            },
          },
          {
            $unwind: {
              path: "$employer_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "employers",
              localField: "assignto",
              foreignField: "_id",
              as: "employer_details1",
            },
          },
          {
            $unwind: {
              path: "$employer_details1",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "postemployertypes",
              localField: "employmenttype",
              foreignField: "_id",
              as: "employment_type",
            },
          },
          {
            $unwind: {
              path: "$employment_type",
              preserveNullAndEmptyArrays: true,
            },
          },
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
            resultSet = {
              msg: "success",
              list: count,
              statusCode: 200,
            };
          },
          (err) => {
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
            resultSet = {
              msg: "success",
              list: response,
              statusCode: 200,
            };
          },
          (err) => {
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
          }
        );
      }

      return resultSet;
    } catch (Error) {
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

const checkBookingStatus = new CronJob({
  cronTime: "0 0 * * *", // every 24 hours
  onTick: async function () {
    console.log(`
         Running check
    `);
    const uri = dbUri;
    await mongoose.connect(uri);
    const updatedstatus = await PostJobTable.updateMany(
      {
        is_delete: false,
        active: true,
        expiredOn: {
          $lt: new Date().toDateString(),
          // $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      },
      { $set: { active: false } }
    ).then(
      (response) => {
        resultSet = {
          msg: "Job Status changed successfully",
          statusCode: 200,
        };
      },
      (err) => {
        console.log("err: ", err);
        resultSet = {
          msg: err.message,
          statusCode: 500,
        };
      }
    );
    // PostJobTable.updateMany(
    //   {
    //     active: false,
    //     expiredOn: {
    //       $gte: new Date(),
    //       // $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
    //     },
    //   },
    //   { active: true }
    // );
  },
  start: true,
  timezone: "Asia/kolkata",
});

module.exports = {
  getJobFilterData,
  postJobfilterData,
  getDashboardCount,
  getCandidatelist,
};
