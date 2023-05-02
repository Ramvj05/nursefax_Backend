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
    const { decodeToken, user } = req.headers.user;

    await mongoose.connect(uri);
    try {
      // console.log(request.files, "request.files");
      const count = await PostJobTable.find({}).count();
      console.log(count);
      let postId;
      if (count < 10) {
        postId = `JOBS-00000${count + 1}`;
      } else if (count < 100) {
        postId = `JOBS-0000${count + 1}`;
      } else if (count < 1000) {
        postId = `JOBS-000${count + 1}`;
      } else if (count < 10000) {
        postId = `JOBS-00${count + 1}`;
      } else if (count < 100000) {
        postId = `JOBS-0${count + 1}`;
      } else {
        postId = `JOBS-${count + 1}`;
      }
      let ins = {};
      if (request.files) {
        uploadpath = __dirname + "/../../../uploads/Employers/";
        // console.log(uploadpath, "uploadpath");
        ins.uploadfile = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "uploadfile"
        );
      }
      ins.posttitle = request.body.posttitle;
      ins.posttitle = postId;
      ins.description = request.body.description;
      ins.smalldescription = request.body.smalldescription;
      ins.postlable = request.body.postlable;
      ins.minsalary = request.body.minsalary;
      ins.maxsalary = request.body.maxsalary;
      ins.employername = request.body.employername;
      ins.employmenttype = request.body.employmenttype;
      ins.hospitalname = request.body.hospitalname;
      ins.country = request.body.country;
      ins.city = request.body.city;
      ins.state = request.body.state;
      ins.email = request.body.email;
      ins.keyword = request.body.keyword;
      ins.expiredOn = request.body.expiredOn;
      ins.createdBy = decodeToken.id;
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
      const { decodeToken, user } = req.headers.user;

      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      if (request.files) {
        // console.log("coming 1");
        uploadpath = __dirname + "/../../../uploads/Employers/";
        upd.uploadfile = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "uploadfile"
        );
      }
      upd.posttitle = request.body.posttitle;
      upd.description = request.body.description;
      upd.smalldescription = request.body.smalldescription;
      upd.minsalary = request.body.minsalary;
      upd.maxsalary = request.body.maxsalary;
      upd.postlable = request.body.postlable;
      upd.employername = request.body.employername;
      upd.employmenttype = request.body.employmenttype;
      upd.hospitalname = request.body.hospitalname;
      upd.country = request.body.country;
      upd.keyword = request.body.keyword;
      upd.city = request.body.city;
      upd.state = request.body.state;
      upd.email = request.body.email;
      upd.expiredOn = request.body.expiredOn;
      upd.createdBy = decodeToken.id;
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

async function updateJobStatus(req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const data = req.body
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    console.log(id);
    if (user.roles.includes("ADMIN")) {
      const updatedstatus = await PostJobTable.findOneAndUpdate(
        {
          is_delete: false,
          _id: id,
        },
        { $set: { active: data.Status } },

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
            message: "Job Approved Successfully",
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


module.exports = {
  getPostJobData,
  savePostJob,
  updatePostJob,
  deletePostJob,
  updateJobStatus

};

// module.exports = router;