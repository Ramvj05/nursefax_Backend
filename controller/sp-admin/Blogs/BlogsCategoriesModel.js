const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const BlogsCategoriesTable = require("../../../model/BlogsModel/TableCategories");
const router = express.Router();
const FileHandler = require('../../../Helpers/FileHandler');


async function getBlogCategoriesData(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
console.log(request.params.id,"request.params.id")
      const category = {};
      if (typeof request.params.id !== 'undefined') {
        await BlogsCategoriesTable.findById({
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
        await BlogsCategoriesTable.find({ is_delete: false }).then(response => {
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
async function saveBlogCategories(request) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    await mongoose.connect(uri);
    try {
      let ins = {};
      if (request.files) {
        uploadpath = __dirname + '/../../../uploads/BlogsCategories/';
        ins.BlogCategoryImage = await FileHandler.uploadAvatar(request, uploadpath, "BlogCategoryImage")

      }

      ins.CategoryName = request.body.CategoryName;
      ins.FeaturedCategory = request.body.FeaturedCategory;
      ins.CateURL = request.body.CateURL;
      ins.SEOTitle = request.body.SEOTitle;
      ins.SEODescription = request.body.SEODescription;
      ins.Description = request.body.Description;
      ins.SEOKeyword = request.body.SEOKeyword;
      ins.Status = request.body.Status;
      ins.createDt = new Date();
      ins.modifyDt = new Date();

      let insert = new BlogsCategoriesTable(ins)
      await insert.save().then(response => {
        resultSet = {
          "msg": "Category Created successfully",
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

async function updateBlogCategories(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      if (request.files) {
        uploadpath = __dirname + '/../../../uploads/BlogsCategories/';
        ins.BlogCategoryImage = await FileHandler.uploadAvatar(request, uploadpath, "BlogCategoryImage")

      }
      upd.CategoryName = request.body.CategoryName;
      upd.FeaturedCategory = request.body.FeaturedCategory;
      upd.CateURL = request.body.CateURL;
      upd.SEOTitle = request.body.SEOTitle;
      upd.SEODescription = request.body.SEODescription;
      upd.Description = request.body.Description;
      upd.SEOKeyword = request.body.SEOKeyword;
      upd.Status = request.body.Status;
      upd.modifyDt = new Date();
      await BlogsCategoriesTable.updateMany({
        _id: request.params.id
      }, {
        $set: upd
      })
        .then(response => {
          resultSet = {
            "msg": "Category updated successfully",
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
async function deleteBlogCategories(request) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    await mongoose.connect(uri);
    try {
      await BlogsCategoriesTable.updateMany({
        _id: request.params.id
      }, {
        $set: {
          is_delete: true
        }
      }).then(response => {
        resultSet = {
          "msg": "Category Deleted Successfully",
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
async function deleteBlogCategoriesImg(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await BlogsCategoriesTable.findById({
        _id: request.params.id
      }).then(response => {
        if (request.body.imageName == "UploadImage") {
          uploadpath = __dirname + '/../../../uploads/BlogsCategories/';
          var filePath = uploadpath + response.UploadImage;
          var unl = fs.unlinkSync(filePath);
          let upd = {};
          upd.UploadImage = "";
          let id = mongoose.Types.ObjectId(request.params.id);
          BlogsCategoriesTable.updateMany({
            _id: id
          }, {
            $set: upd
          })
            // BlogsCategoriesTable.updateMany({_id:request.params.id},
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
          uploadpath = __dirname + '/../../../uploads/BlogsCategories/';
          var filePath = uploadpath + response.CategoryIcon;
          fs.unlinkSync(filePath);
          let upd = {};
          upd.CategoryIcon = "";

          BlogsCategoriesTable.updateMany({
            _id: request.params.id
          }, {
            $set: upd
          })
            // BlogsCategoriesTable.updateMany({_id:request.params.id},
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
  getBlogCategoriesData,
  saveBlogCategories,
  updateBlogCategories,
  deleteBlogCategories,
  deleteBlogCategoriesImg
};

// module.exports = router;
