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
        const blog_id = new mongoose.Types.ObjectId(request.body.blog_id);
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              // blog_id,
              user_id,
              type: "blog",
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
        const event_id = new mongoose.Types.ObjectId(request.body.event_id);
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              // event_id,
              user_id,
              type: "events",
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
        const eam_id = new mongoose.Types.ObjectId(request.body.eam_id);
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              // eam_id,
              user_id,
              type: "exam",
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
        const job_id = new mongoose.Types.ObjectId(request.body.job_id);
        const user_id = new mongoose.Types.ObjectId(decodeToken.id);
        var data = await WishListModel.aggregate([
          {
            $match: {
              // job_id,
              user_id,
              type: "job",
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
      ins.course_id = data.course_id;
      ins.exam_id = data.exam_id;
      ins.blog_id = data.blog_id;
      ins.event_id = data.event_id;
      ins.job_id = data.job_id;
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
