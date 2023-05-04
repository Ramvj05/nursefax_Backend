const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const WishListModel = require("../../../model/TableCollections/TableWishlist");

async function getWishlistData(request) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const user_id = new mongoose.Types.ObjectId(request.params.id);
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
        ]).then(
          (response) => {
            console.log("response: " + response);
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
      } else {
        var data = await WishListModel.aggregate([
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
            console.log("response: " + response);
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

async function saveWishlist(request) {
  const { user } = request.headers.user;
  const data = request.body;
  const uri = dbUri;
  await mongoose.connect(uri);
  if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    try {
      let ins = {};
      ins.user_id = data.user_id;
      ins.course_id = data.course_id;
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
      console.log(Error, "ooooooooooooooo");
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

async function updateWishlist(req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const data = req.body;
  const uri = dbUri;
  await mongoose.connect(uri);

  if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    try {
      const updatedstatus = await WishListModel.findOneAndUpdate(
        {
          is_delete: false,
          _id: id,
        },
        { $set: { Status: data.Status } }
      ).then(
        (response) => {
          resultSet = {
            msg: "Wishlist Updated successfully",
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
      console.log(Error, "ooooooooooooooo");
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
async function deleteWishlist(req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
    try {
      const test = await WishListModel.findOneAndUpdate(
        {
          is_delete: false,
          _id: id,
        },
        { is_delete: true }
      ).then(
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
      console.log(Error, "ooooooooooooooo");
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
  getWishlistData,
  saveWishlist,
  updateWishlist,
  deleteWishlist,
};
