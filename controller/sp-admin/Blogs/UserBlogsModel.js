const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const UserBlogsTable = require("../../../model/BlogsModel/TableUserBlogs");
const router = express.Router();


async function getUserBlogsData(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const category = {};
      if (typeof request.params.id !== 'undefined') {
        console.log("1111")
        await UserBlogsTable.findById({
          _id: request.params.id
        })
          .then(response => {
            resultSet = {
              "msg": "success",
              "list": response,
              "statusCode": 200
            }

          }, err => {
            console.log('err: ', err);
            resultSet = {
              "msg": err.message,
              "statusCode": 500
            }
          });
        console.log("22222", category)
      } else {
        await UserBlogsTable.find({ is_delete: false }).then(response => {
          resultSet = {
            "msg": "success",
            "list": response,
            "statusCode": 200
          }

        }, err => {
          console.log('err: ', err);
          resultSet = {
            "msg": err.message,
            "statusCode": 500
          }
        });
      }

      return resultSet;


    } catch (Error) {
      resultSet = {
        "msg": Error,
        "statusCode": 500
      }
      return resultSet;
    }

  } else {
    resultSet = {
      "msg": "No direct Access Allowed",
      "statusCode": 500
    }
    return resultSet;
  }
}
async function saveUserBlogs(request) {
  // console.log(request.body);

  if (request != "" && typeof request !== "undefined") {
    //console.log("request", request.files)
    const uri = dbUri;
    await mongoose.connect(uri);
    try {
      let ins = {};
      if (request.files) {
        uploadpath = __dirname + '/../../../uploads/Blogs/';
        ins.BlogImage = await FileHandler.uploadAvatar(request, uploadpath, "BlogImage")
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
      ins.MetaDescription = request.body.MetaDescription;
      ins.MetaKeyword = request.body.MetaKeyword;
      ins.user_id = request.body.user_id;
      ins.Status = request.body.Status;
      ins.createDt = request.body.createDt;
      ins.modifyDt = request.body.modifyDt;
      console.log("ins", ins);

      let insert = new UserBlogsTable(ins)
      await insert.save().then(response => {
        resultSet = {
          "msg": "Blog Created successfully",
          "statusCode": 200
        }

      }, err => {
        console.log('err: ', err);
        resultSet = {
          "msg": err.message,
          "statusCode": 500
        }
      });

      return resultSet;


    } catch (Error) {
      resultSet = {
        "msg": Error,
        "statusCode": 400
      }
      return resultSet;
    }

  } else {
    resultSet = {
      "msg": "No direct Access Allowed",
      "statusCode": 500
    }
    return resultSet;
  }
}

async function updateUserBlogs(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      if (request.files) {
        console.log("coming 1")
        uploadpath = __dirname + '/../../../uploads/Blogs/';
        ins.BlogImage = await FileHandler.uploadAvatar(request, uploadpath, "BlogImage")

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
      upd.MetaKeyword = request.body.MetaKeyword;
      upd.user_id = request.body.user_id;
      upd.Status = request.body.Status;
      upd.modifyDt = request.body.modifyDt;
      console.log("upd", upd);

      await UserBlogsTable.updateMany({
        _id: request.params.id
      }, {
        $set: upd
      })
        .then(response => {
          resultSet = {
            "msg": "Blog updated successfully",
            "statusCode": 200
          }

        }, err => {
          console.log('err: ', err);
          resultSet = {
            "msg": err.message,
            "statusCode": 500
          }
        });

      return resultSet;


    } catch (Error) {
      resultSet = {
        "msg": Error,
        "statusCode": 400
      }
      return resultSet;
    }

  } else {
    resultSet = {
      "msg": "No direct Access Allowed",
      "statusCode": 500
    }
    return resultSet;
  }
}
async function deleteUserBlogs(request) {
  console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await UserBlogsTable.updateMany({
        _id: request.params.id
      }, {
        $set: {
          is_delete: true
        }
      }).then(response => {
        resultSet = {
          "msg": "Blog Deleted Successfully",
          "statusCode": 200
        }

      }, err => {
        console.log('err: ', err);
        resultSet = {
          "msg": err.message,
          "statusCode": 500
        }
      })

      return resultSet;


    } catch (Error) {
      resultSet = {
        "msg": Error,
        "statusCode": 400
      }
      return resultSet;
    }

  } else {
    resultSet = {
      "msg": "No direct Access Allowed",
      "statusCode": 500
    }
    return resultSet;
  }
}
async function deleteUserBlogsImg(request) {
  console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await UserBlogsTable.findById({
        _id: request.params.id
      }).then(response => {
        if (request.body.imageName == "BlogImage") {
          uploadpath = __dirname + '/../../../uploads/Blogs/';
          var filePath = uploadpath + response.BlogImage;
          var unl = fs.unlinkSync(filePath);
          let upd = {};
          upd.BlogImage = "";
          let id = mongoose.Types.ObjectId(request.params.id);
          UserBlogsTable.updateMany({
            _id: id
          }, {
            $set: upd
          })
            // UserBlogsTable.updateMany({_id:request.params.id},
            //     {
            //         $set : upd
            //         }
            //      )

            .then(response1 => {
              resultSet = {
                "msg": "Upload Image Deleted Successfully!!",
                "statusCode": 200
              }
              return resultSet;
            }, err => {
              console.log('err: ', err);
              resultSet = {
                "msg": err.message,
                "statusCode": 500
              }
              return resultSet;
            });

          //return resultSet;
        } else if (request.body.imageName == "CategoryIcon") {
          uploadpath = __dirname + '/../../../uploads/Blogs/';
          var filePath = uploadpath + response.CategoryIcon;
          fs.unlinkSync(filePath);
          let upd = {};
          upd.CategoryIcon = "";

          UserBlogsTable.updateMany({
            _id: request.params.id
          }, {
            $set: upd
          })
            // UserBlogsTable.updateMany({_id:request.params.id},
            //     {
            //         $set : upd
            //         }
            //      )
            .then(response1 => {
              resultSet = {
                "msg": "CategoryIcon Deleted Successfully!!",
                "statusCode": 200
              }

            }, err => {
              console.log('err: ', err);
              resultSet = {
                "msg": err.message,
                "statusCode": 500
              }
            });
        }
        //return resultSet;
        resultSet = { "msg": " Upload Image Deleted Successfully!!", "statusCode": 200 }

      }
        , err => {
          console.log('err: ', err);
          resultSet = {
            "msg": err.message,
            "statusCode": 500
          }
        });

      return resultSet;


    } catch (Error) {
      resultSet = {
        "msg": Error,
        "statusCode": 400
      }
      return resultSet;
    }

  } else {
    resultSet = {
      "msg": "No direct Access Allowed",
      "statusCode": 500
    }
    return resultSet;
  }

  return resultSet;
}


// router.post("/create", authorizer, async function (req, res) {
//   const { decodeToken, user } = req.headers.user;
//   let body = new CategoryClass(req.body).getModel();
//   console.log(body);
//   const uri = dbUri;
//   await mongoose.connect(uri);

//   body = {
//     ...body,
//     createdBy: decodeToken.id,
//   };

//   try {
//     if (user.roles.includes("ADMIN")) {
//       const newCategoryModel = new CategoryModel(body);
//       const data = await newCategoryModel.save();
//       res
//         .header({
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//         })
//         .status(200)
//         .send({
//           data: data,
//           message: "category Created Successfully",
//           statsCode: 200,
//           error: null,
//         });
//     } else {
//       res
//         .header({
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//         })
//         .status(401)
//         .send({
//           data: null,
//           message: "You do not have access to create category",
//           statsCode: 401,
//           error: {
//             message: "Access denied",
//           },
//         });
//     }
//   } catch (err) {
//     console.log(err);
//     res
//       .header({
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//       })
//       .status(500)
//       .send({
//         statsCode: 500,
//         data: null,
//         message: "Somthing went wrong",
//         error: err,
//       });
//   }
// });

module.exports = {
    getUserBlogsData,
    saveUserBlogs,
    updateUserBlogs,
    deleteUserBlogs,
    deleteUserBlogsImg
};

// module.exports = router;
