const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const CourseModel = require("../../../model/course.model");
const JobModel = require("../../../model/TableCollections/TablePostJob");
const RatingsModel = require("../../../model/TableCollections/TableRatings");

async function getCourseRealted(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(request.params.id);
        const Course = await CourseModel.findById({ _id: _id });
        if (Course.category && Course.category != "") {
          var dataa = await CourseModel.find({
            category: Course.category,
          }).then(
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
        } else {
          resultSet = {
            msg: "No Category Found",
            statusCode: 500,
          };
        }
      } else {
        var data = await CourseModel.aggregate([
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
async function getJobRelated(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(request.params.id);
        const job = await JobModel.findById({ _id: _id });
        var data = await JobModel.aggregate([
          {
            $match: {
              $or: [{ country: job.country }, { speciality: job.speciality }],
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
      } else {
        var data = await UserRatingsTable.aggregate([
          {
            $match: {
              is_delete: false,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "userdetails",
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
async function saveRatings(request, response) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      const { decodeToken, user } = req.headers.user;
      await mongoose.connect(uri);
      const data = request.body;
      let ins = {};
      ins.user_id = decodeToken.id;
      ins.course_id = data.course_id;
      ins.ratings = data.ratings;
      ins.comments = data.comments;
      ins.status = data.status;
      ins.is_delete = data.is_delete;
      ins.createDt = data.createDt;
      ins.modifyDt = data.modifyDt;
      let insert = new RatingsModel(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Ratings Created successfully",
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
      return resultSet;
    } catch (Error) {
      resultSet = {
        msg: Error,
        statusCode: 400,
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
async function getRatings(request, response) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      const { decodeToken, user } = req.headers.user;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
      } else {
        const data = await RatingsModel.findOne({ _id: req.params.id }).then(
          (response) => {
            resultSet = {
              msg: "Ratings Created successfully",
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
      }

      return resultSet;
    } catch (Error) {
      resultSet = {
        msg: Error,
        statusCode: 400,
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
async function deleteRatings(request, response) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      const { decodeToken, user } = req.headers.user;
      await mongoose.connect(uri);
      await RatingsModel.updateOne(
        {
          _id: request.params.id,
        },
        {
          $set: {
            is_delete: true,
          },
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Ratings Created successfully",
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
      return resultSet;
    } catch (Error) {
      resultSet = {
        msg: Error,
        statusCode: 400,
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
async function updateRatings(request, response) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      const { decodeToken, user } = req.headers.user;
      await mongoose.connect(uri);
      const data = request.body;
      let upd = {};
      upd.user_id = decodeToken.id;
      upd.course_id = data.course_id;
      upd.ratings = data.ratings;
      upd.comments = data.comments;
      await RatingsModel.updateMany(
        {
          _id: request.params.id,
        },
        {
          $set: upd,
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Ratings Created successfully",
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
      return resultSet;
    } catch (Error) {
      resultSet = {
        msg: Error,
        statusCode: 400,
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
  getJobRelated,
  getCourseRealted,
  updateRatings,
  deleteRatings,
  saveRatings,
  getRatings,
};
