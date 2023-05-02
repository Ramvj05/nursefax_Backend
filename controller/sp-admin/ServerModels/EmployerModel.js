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
      if (request.files) {
        uploadpath = __dirname + "/../../../uploads/Blogs/";
        // console.log(uploadpath, "uploadpath");
        ins.BlogImage = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "BlogImage"
        );
      }
      ins.BlogTitle = request.body.BlogTitle;
      ins.TopStories = request.body.TopStories;
      ins.BlogURL = request.body.BlogURL;
      ins.PrimaryCategory = request.body.PrimaryCategory;
      ins.OtherCategory = request.body.OtherCategory;
      ins.ShortDescription = request.body.ShortDescription;
      ins.HomePage = request.body.HomePage;
      ins.Description = request.body.Description;
      ins.YouTubeURL = request.body.YouTubeURL;
      ins.MetaTitle = request.body.MetaTitle;
      ins.user_id = request.body.user_id;
      ins.user_type = request.body.user_type;
      ins.MetaDescription = request.body.MetaDescription;
      ins.MetaKeyword = request.body.MetaKeyword;
      ins.Status = request.body.Status;
      ins.createDt = new Date();
      ins.modifyDt = new Date();
      // console.log("ins", ins);

      let insert = new PostJobTable(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Blog Created successfully",
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
      if (request.files) {
        // console.log("coming 1");
        uploadpath = __dirname + "/../../../uploads/Blogs/";
        upd.BlogImage = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "BlogImage"
        );
      }
      upd.BlogTitle = request.body.BlogTitle;
      upd.TopStories = request.body.TopStories;
      upd.BlogURL = request.body.BlogURL;
      upd.PrimaryCategory = request.body.PrimaryCategory;
      upd.OtherCategory = request.body.OtherCategory;
      upd.ShortDescription = request.body.ShortDescription;
      upd.HomePage = request.body.HomePage;
      upd.Description = request.body.Description;
      upd.YouTubeURL = request.body.YouTubeURL;
      upd.MetaTitle = request.body.MetaTitle;
      upd.MetaDescription = request.body.MetaDescription;
      upd.user_id = request.body.user_id;
      upd.user_type = request.body.user_type;
      upd.MetaKeyword = request.body.MetaKeyword;
      upd.Status = request.body.Status;
      upd.modifyDt = new Date();
      // console.log("upd", upd);

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
            msg: "Blog updated successfully",
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
async function deletePostJobImg(request) {
  // console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await PostJobTable.findById({
        _id: request.params.id,
      }).then(
        (response) => {
          if (request.body.imageName == "BlogImage") {
            uploadpath = __dirname + "/../../../uploads/PostJob/";
            var filePath = uploadpath + response.BlogImage;
            var unl = fs.unlinkSync(filePath);
            let upd = {};
            upd.BlogImage = "";
            let id = mongoose.Types.ObjectId(request.params.id);
            PostJobTable.updateMany(
              {
                _id: id,
              },
              {
                $set: upd,
              }
            )
              // PostJobTable.updateMany({_id:request.params.id},
              //     {
              //         $set : upd
              //         }
              //      )

              .then(
                (response1) => {
                  resultSet = {
                    msg: "Upload Image Deleted Successfully!!",
                    statusCode: 200,
                  };
                  return resultSet;
                },
                (err) => {
                  // console.log("err: ", err);
                  resultSet = {
                    msg: err.message,
                    statusCode: 500,
                  };
                  return resultSet;
                }
              );

            //return resultSet;
          } else if (request.body.imageName == "CategoryIcon") {
            uploadpath = __dirname + "/../../../uploads/PostJob/";
            var filePath = uploadpath + response.CategoryIcon;
            fs.unlinkSync(filePath);
            let upd = {};
            upd.CategoryIcon = "";

            PostJobTable.updateMany(
              {
                _id: request.params.id,
              },
              {
                $set: upd,
              }
            )
              // PostJobTable.updateMany({_id:request.params.id},
              //     {
              //         $set : upd
              //         }
              //      )
              .then(
                (response1) => {
                  resultSet = {
                    msg: "CategoryIcon Deleted Successfully!!",
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
          //return resultSet;
          resultSet = {
            msg: " Upload Image Deleted Successfully!!",
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

  return resultSet;
}



module.exports = {
  getPostJobData,
  savePostJob,
  updatePostJob,
  deletePostJob,
  deletePostJobImg
};

// module.exports = router;