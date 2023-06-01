const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const WishListModel = require("../../../model/TableCollections/UserWishlist");

async function getCourseWishlistData(request, res) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    const { user, decodeToken } = request.headers.user;
    const uri = dbUri;
    await mongoose.connect(uri);
    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      try {
        const course_id = new mongoose.Types.ObjectId(request.body.course_id);
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              type: "COURSE",
              user_id,
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
          {
            $lookup: {
              from: "courses",
              localField: "course_id",
              foreignField: "_id",
              as: "coursesdeatils",
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
            console.log("err: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
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
        msg: "You do not have access",
        statusCode: 500,
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
async function getBlogWishlistData(request, res) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    const { user, decodeToken } = request.headers.user;
    const uri = dbUri;
    await mongoose.connect(uri);
    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      try {
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              type: "BLOG",

              user_id,
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
          {
            $lookup: {
              from: "blogs",
              localField: "blog_id",
              foreignField: "_id",
              as: "blog_details",
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
            console.log("err: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
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
        msg: "You do not have access",
        statusCode: 500,
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
async function getEventWishlistData(request, res) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    const { user, decodeToken } = request.headers.user;
    const uri = dbUri;
    await mongoose.connect(uri);
    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      try {
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              type: "EVENT",

              user_id,
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
          {
            $lookup: {
              from: "postevents",
              localField: "event_id",
              foreignField: "_id",
              as: "event_details",
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
            console.log("err: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
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
        msg: "You do not have access",
        statusCode: 500,
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
async function getExamWishlistData(request, res) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    const { user, decodeToken } = request.headers.user;
    const uri = dbUri;
    await mongoose.connect(uri);
    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      try {
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              type: "EXAM",

              user_id,
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
          {
            $lookup: {
              from: "exams",
              localField: "exam_id",
              foreignField: "_id",
              as: "exam_details",
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
            console.log("err: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
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
        msg: "You do not have access",
        statusCode: 500,
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
async function getJobWishlistData(request, res) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    const { user, decodeToken } = request.headers.user;
    const uri = dbUri;
    await mongoose.connect(uri);
    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      try {
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              type: "JOB",

              user_id,
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
          {
            $lookup: {
              from: "postjobs",
              localField: "job_id",
              foreignField: "_id",
              as: "exam_details",
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
            console.log("err: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
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
        msg: "You do not have access",
        statusCode: 500,
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

async function saveCourseWishlist(request, res) {
  const { user, decodeToken } = request.headers.user;
  const data = request.body;
  const uri = dbUri;
  await mongoose.connect(uri);
  if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    try {
      let ins = {};
      ins.user_id = decodeToken.id;
      ins.course_id = data.COURSE_ID;
      ins.exam_id = data.EXAM_ID;
      ins.blog_id = data.BLOG_ID;
      ins.event_id = data.EVENT_ID;
      ins.job_id = data.JOB_ID;
      ins.type = data.type;
      let insert = new WishListModel(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Wishlist Created successfully",
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

      return resultSet;
    } catch (Error) {
      // console.log(Error, "ooooooooooooooo");
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

async function deleteCourseWishlist(req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    try {
      const test = await WishListModel.deleteOne({
        is_delete: false,
        _id: id,
      }).then(
        (response) => {
          resultSet = {
            msg: "Wishlist Deleted successfully",
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

      return resultSet;
    } catch (Error) {
      // console.log(Error, "ooooooooooooooo");
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
  getCourseWishlistData,
  saveCourseWishlist,
  deleteCourseWishlist,
  getBlogWishlistData,
  getEventWishlistData,
  getExamWishlistData,
  getJobWishlistData,
};
