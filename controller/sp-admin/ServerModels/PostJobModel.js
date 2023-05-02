const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const PostJobTable = require("../../../model/TableCollections/TablePostJob");
const FileHandler = require("../../../Helpers/FileHandler");

async function getPostJobData(request) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(request.params.id);
        var data = await PostJobTable.aggregate([
          {
            $match: {
              _id,
              is_delete: false
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "user_id",
          //     foreignField: "_id",
          //     as: "userdetails"
          //   }
          // },
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
            console.log("response: ", response)
            resultSet = { msg: "success", list: response, statusCode: 200, };
          },
          (err) => {
            console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500, };
          }
        );
      } else {

        // var counts= await PostJobViewTable.find({blog_id:_id}).count()
        var data = await PostJobTable.aggregate([
          {
            $match: {
              is_delete: false
            }

          },

          //   {
          //     $lookup: {
          //       from: "users",
          //       localField: "user_id",
          //       foreignField: "_id",
          //       as: "userdetails"
          //     }
          //   },
          //   {
          //     $lookup: {
          //       from: "blogcategories",
          //       localField: "PrimaryCategory",
          //       foreignField: "_id",
          //       as: "categordetails"
          //     }
          //   },
          //   {
          //     $lookup: {
          //       from: "PostJobviews",
          //       localField: "_id",
          //       foreignField: "blog_id",
          //       as: "views"
          //     }
          //   },
          //   {$project: { count: { $size:"$views" },"categordetails":1,"userdetails":1,BlogTitle:1,_id:1,TopStories:1,HomePage:1
          // ,BlogURL:1,OtherCategory:1,ShortDescription:1,BlogImage:1,Description:1,YouTubeURL:1,MetaTitle:1,MetaDescription:1,
          // MetaKeyword:1,createDt:1,modifyDt:1,Status:1}},
          //   {$unwind:"$userdetails"},
          //   {$unwind:"$categordetails"}

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

async function savePostJob(request) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    await mongoose.connect(uri);
    try {
      // console.log(request.files, "request.files");

      let ins = {};
      // if (request.files) {
      //   uploadpath = __dirname + "/../../../uploads/Blogs/";
      //   // console.log(uploadpath, "uploadpath");
      //   ins.BlogImage = await FileHandler.uploadAvatar(
      //     request,
      //     uploadpath,
      //     "BlogImage"
      //   );
      // }
      ins.posttitle = request.body.posttitle;
      ins.description = request.body.description;
      ins.postlable = request.body.postlable;
      ins.employername = request.body.employername;
      ins.employmenttype = request.body.employmenttype;
      ins.hospitalname = request.body.hospitalname;
      ins.country = request.body.country;
      ins.city = request.body.city;
      ins.email = request.body.email;
      ins.createdBy = request.body.createdBy;
      ins.createdOn = new Date();
      ins.modifyOn = new Date();
      // console.log("ins", ins);

      let insert = new PostJobTable(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Job Created successfully",
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

async function updatePostJob(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      // if (request.files) {
      //   // console.log("coming 1");
      //   uploadpath = __dirname + "/../../../uploads/Blogs/";
      //   upd.BlogImage = await FileHandler.uploadAvatar(
      //     request,
      //     uploadpath,
      //     "BlogImage"
      //   );
      // }
      upd.posttitle = request.body.posttitle;
      upd.description = request.body.description;
      upd.postlable = request.body.postlable;
      upd.employername = request.body.employername;
      upd.employmenttype = request.body.employmenttype;
      upd.hospitalname = request.body.hospitalname;
      upd.country = request.body.country;
      upd.city = request.body.city;
      upd.email = request.body.email;
      upd.createdBy = request.body.createdBy;
      upd.createdOn = new Date();
      upd.modifyOn = new Date();

      await PostJobTable.updateMany(
        {
          _id: request.params.id,
        },
        {
          $set: upd,
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Job updated successfully",
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
      // console.log(Error, "Error");
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
async function deletePostJob(request) {
  // console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await PostJobTable.updateMany(
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
            msg: "Blog Deleted Successfully",
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
  getPostJobData,
  savePostJob,
  updatePostJob,
  deletePostJob,
  
};

// module.exports = router;