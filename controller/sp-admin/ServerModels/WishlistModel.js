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
              is_delete:false
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "userdetails"
            }
          },

        ]).then(
          (response) => {
            console.log("response: " + response)
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
              $match:{
                is_delete:false
              }
              
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "userdetails"
            }
          },

        ]).then(
          (response) => {
            console.log("response: " + response)
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
      console.log("error: " + Error)
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
  const { user } = req.headers.user;
  const data=request.body
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

async function updateWishlist(req,res) {
  const { user } = req.headers.user;
    const { id } = req.params;
    const data=req.body
    const uri = dbUri;
    await mongoose.connect(uri);
  
    try {
      console.log(id);
      if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
        const updatedstatus = await WishListModel.findOneAndUpdate(
          {
            is_delete: false,
            _id: id,
          },
          {$set: {Status:data.Status}},
         
        );
  
        console.log(updatedstatus);
        if (updatedstatus) {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              // data: updatedstatus,
              message: "Wishlist Added Successfully",
              statsCode: 200,
              error: null,
            });
        } else {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(404)
            .send({
              data: null,
              message: "No test Found",
              statsCode: 404,
              error: {
                message: "No data present",
              },
            });
        }
      } else {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(401)
          .send({
            data: null,
            message: "You do not have access to modify course",
            statsCode: 401,
            error: {
              message: "Access denied",
            },
          });
      }
    } catch (err) {
      console.log(err);
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(500)
        .send({
          statsCode: 500,
          data: null,
          message: "Somthing went wrong",
          error: err,
        });
    }
}
async function deleteWishlist(req,res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (user.roles.includes("ADMIN") || user.roles.includes("STUDENT")) {
      const test = await WishListModel.findOneAndUpdate(
        {
          is_delete: false,
          _id: id,
        },
        { is_delete: true },
        
      );

      console.log(test);
      if (test) {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(200)
          .send({
            data: test,
            message: "course modified successfully",
            statsCode: 200,
            error: null,
          });
      } else {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(404)
          .send({
            data: null,
            message: "course Not Found",
            statsCode: 404,
            error: {
              message: "No data present",
            },
          });
      }
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(401)
        .send({
          data: null,
          message: "You do not have access to modilfy course",
          statsCode: 401,
          error: {
            message: "Access denied",
          },
        });
    }
  } catch (err) {
    console.log(err);
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(500)
      .send({
        statsCode: 500,
        data: null,
        message: "Somthing went wrong",
        error: err,
      });
  }
}



module.exports = {
  getWishlistData,
  saveWishlist,
  updateWishlist,
  deleteWishlist,
};
