const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const PostJobTable = require("../../../model/TableCollections/TablePostJob");
const ApplyJobTable = require("../../../model/TableCollections/TableApplyJob");
const FileHandler = require("../../../Helpers/FileHandler");

async function getPostJobData(req, res) {
  //console.log("req",req);
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof req.params.id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(req.params.id);
        var data = await PostJobTable.aggregate([
          {
            $match: {
              _id,
              is_delete: false,
            },
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
            console.log("response: ", response);
            resultSet = { msg: "success", list: response, statusCode: 200 };
          },
          (err) => {
            console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500 };
          }
        );
      } else if (typeof req.params.user_id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(req.params.user_id);
        var data = await ApplyJobTable.aggregate([
          {
            $match: {
              user_id,
              is_delete: false,
            },
          },
          {
            $lookup: {
              from: "PostJob",
              localField: "job_id",
              foreignField: "_id",
              as: "jobdetails",
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
            console.log("response: ", response);
            resultSet = { msg: "success", list: response, statusCode: 200 };
          },
          (err) => {
            console.log("err: ", err);
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

async function savePostJob(req, res) {
  if (req != "" && typeof req !== "undefined") {
    const uri = dbUri;
    const { decodeToken, user } = req.headers.user;
    await mongoose.connect(uri);
    try {
      // console.log(req.files, "req.files");
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
      if (req.files) {
        uploadpath = __dirname + "/../../../uploads/Employers/";
        // console.log(uploadpath, "uploadpath");
        ins.uploadfile = await FileHandler.uploadAvatar(
          req,
          uploadpath,
          "uploadfile"
        );
      }
      ins.posttitle = req.body.posttitle;
      ins.postId = postId;
      ins.description = req.body.description;
      ins.section = req.body.section;
      ins.postlable = req.body.postlable;
      ins.minsalary = req.body.minsalary;
      ins.maxsalary = req.body.maxsalary;
      ins.employername = req.body.employername;
      ins.employmenttype = req.body.employmenttype;
      ins.speciality = req.body.speciality;
      ins.enabled = req.body.enabled;
      ins.country = req.body.country;
      ins.city = req.body.city;
      ins.state = req.body.state;
      ins.navlink = req.body.navlink;
      ins.keyword = req.body.keyword;
      ins.expiredOn = req.body.expiredOn;
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

async function updatePostJob(req, res) {
  if (req != "" && typeof req !== "undefined") {
    try {
      const { decodeToken, user } = req.headers.user;

      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      if (req.files) {
        // console.log("coming 1");
        uploadpath = __dirname + "/../../../uploads/Employers/";
        upd.uploadfile = await FileHandler.uploadAvatar(
          req,
          uploadpath,
          "uploadfile"
        );
      }
      upd.posttitle = req.body.posttitle;
      upd.description = req.body.description;
      upd.section = req.body.section;
      upd.minsalary = req.body.minsalary;
      upd.maxsalary = req.body.maxsalary;
      upd.postlable = req.body.postlable;
      upd.employername = req.body.employername;
      upd.employmenttype = req.body.employmenttype;
      upd.speciality = req.body.speciality;
      upd.country = req.body.country;
      upd.enabled = req.body.enabled;
      upd.keyword = req.body.keyword;
      upd.city = req.body.city;
      upd.navlink = req.body.navlink;
      upd.state = req.body.state;
      upd.expiredOn = req.body.expiredOn;
      upd.createdBy = decodeToken.id;
      upd.modifyOn = new Date();

      await PostJobTable.updateMany(
        {
          _id: req.params.id,
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
async function deletePostJob(req, res) {
  // console.log(req.body);
  if (req != "" && typeof req !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await PostJobTable.updateMany(
        {
          _id: req.params.id,
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
  const data = req.body;
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
        { $set: { active: data.Status } }
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
async function saveApplyJob(req, res) {
  if (req != "" && typeof req !== "undefined") {
    const uri = dbUri;
    const { decodeToken, user } = req.headers.user;

    await mongoose.connect(uri);
    try {
      ins.job_id = req.body.job_id;
      ins.createdBy = decodeToken.id;
      ins.createdOn = new Date();
      ins.modifyOn = new Date();
      // console.log("ins", ins);

      let insert = new ApplyJobTable(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Job Applied successfully",
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
  getPostJobData,
  savePostJob,
  updatePostJob,
  deletePostJob,
  updateJobStatus,
  saveApplyJob,
};

// module.exports = router;
