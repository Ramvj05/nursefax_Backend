const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const BannerModel = require("../../../model/TableCollections/TableBanner");

async function getBanner(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        var dataa = await BannerModel.find({
          _id: request.params.id,
          is_delete: false,
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
        var data = await BannerModel.find({ is_delete: false }).then(
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
async function saveBanner(request, response) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      const { decodeToken, user } = request.headers.user;
      await mongoose.connect(uri);
      const data = request.body;
      let ins = {};
      ins.createdBy = decodeToken.id;
      ins.mobile_banner = data.mobile_banner;
      ins.name = data.name;
      ins.user_image = data.user_image;
      ins.description = data.description;
      ins.banner = data.banner;
      ins.testimonial = data.testimonial;
      ins.createDt = new Date();
      ins.modifyDt = new Date();
      let insert = new BannerModel(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Banner saved successfully",
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
async function updateBanner(request, response) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      const { decodeToken, user } = request.headers.user;
      await mongoose.connect(uri);
      const data = request.body;
      let upd = {};
      upd.createdBy = decodeToken.id;
      upd.mobile_banner = data.mobile_banner;
      upd.banner = data.banner;
      upd.name = data.name;
      upd.user_image = data.user_image;
      upd.description = data.description;
      upd.testimonial = data.testimonial;
      upd.modifyDt = new Date();
      const UpdateBanner = await BannerModel.updateMany(
        {
          _id: request.params.id,
        },
        {
          $set: upd,
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Banner Updated successfully",
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
async function deleteBanner(request, response) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      const { decodeToken, user } = request.headers.user;
      await mongoose.connect(uri);
      await BannerModel.updateOne(
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
            msg: "Banner deleted successfully",
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
  getBanner,
  updateBanner,
  deleteBanner,
  saveBanner,
};
