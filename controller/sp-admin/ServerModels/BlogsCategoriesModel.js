const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const BlogsCategoriesTable = require("../../../model/TableCollections/TableCategories");
const BlogsTable = require("../../../model/TableCollections/TableBlogs");
const router = express.Router();
const FileHandler = require("../../../Helpers/FileHandler");
const { ObjectId } = require("mongodb");

async function getBlogCategoriesData(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const category = {};
      if (typeof request.params.id !== "undefined") {
        // Where = {};
        // console.log(request.params.id, "request.params.id");
        const _id = new mongoose.Types.ObjectId(request.params.id);
        var data = await BlogsCategoriesTable.aggregate([
          {
            $match: {
              _id,
              is_delete: false,
            },
          },
          {
            $lookup: {
              from: "blogs",
              localField: "_id",
              foreignField: "PrimaryCategory",
              as: "blogdetails",
            },
          },
        ]).then(
          (response) => {
            // console.log("response: ", response);
            resultSet = {
              msg: "success",
              list: response,
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
      } else {
        var Resultsdata = [];
        const datastest = await BlogsCategoriesTable.find({ is_delete: false });
        if (datastest.length > 0) {
          for (let category of datastest) {
            var countblogssss = await BlogsTable.find({ is_delete: false });
            var datasseeww = countblogssss.filter(
              (irere) =>
                irere.PrimaryCategory.toString() ==
                ObjectId(category._id).toString()
            );

            Resultsdata.push({
              _id: category._id,
              CategoryName: category.CategoryName,
              FeaturedCategory: category.FeaturedCategory,
              CateURL: category.CateURL,
              SEOTitle: category.SEOTitle,
              SEODescription: category.SEODescription,
              Description: category.Description,
              BlogCategoryImage: category.BlogCategoryImage,
              SEOKeyword: category.SEOKeyword,
              Status: category.Status,
              createDt: category.createDt,
              modifyDt: category.modifyDt,
              is_active: category.is_active,
              count: datasseeww.length,
              is_delete: category.is_delete,
            });
          }
        }
        const Resultdata = Resultsdata.sort((a, b) => b.count - a.count);

        resultSet = {
          msg: "success",
          list: Resultdata,
          statusCode: 200,
        };
      }
      return resultSet;
    } catch (Error) {
      resultSet = {
        msg: Error,
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
async function getBlogCategoriesAllData(request, res) {
  // console.log(request,"request")
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const category = {};
      if (typeof request.params.id !== "undefined") {
        // console.log(request.params.id, "request.params.cate_id");
        const _id = new mongoose.Types.ObjectId(request.params.id);
        var data = await BlogsCategoriesTable.aggregate([
          {
            $match: {
              _id,
              is_delete: false,
            },
          },
          {
            $lookup: {
              from: "blogs",
              localField: "_id",
              foreignField: "PrimaryCategory",
              as: "blogdetails",
            },
          },
          {
            $unwind: {
              path: "$blogdetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "blogdetails.user_id",
              foreignField: "_id",
              as: "userdetails",
            },
          },
        ]).then(
          (response) => {
            // console.log("response: ", response);
            resultSet = {
              msg: "success",
              list: response,
              statusCode: 200,
            };
          },
          (err) => {
            // console.log("ereeeer: ", err);
            resultSet = {
              msg: err.message,
              statusCode: 500,
            };
          }
        );
      } else {
        var Resultsdata = [];
        const datastest = await BlogsCategoriesTable.find({ is_delete: false });
        if (datastest.length > 0) {
          for (let category of datastest) {
            var countblogssss = await BlogsTable.find({ is_delete: false });
            var datasseeww = countblogssss.filter(
              (irere) =>
                irere.PrimaryCategory.toString() ==
                ObjectId(category._id).toString()
            );

            Resultsdata.push({
              _id: category._id,
              CategoryName: category.CategoryName,
              FeaturedCategory: category.FeaturedCategory,
              CateURL: category.CateURL,
              SEOTitle: category.SEOTitle,
              SEODescription: category.SEODescription,
              Description: category.Description,
              BlogCategoryImage: category.BlogCategoryImage,
              SEOKeyword: category.SEOKeyword,
              Status: category.Status,
              createDt: category.createDt,
              modifyDt: category.modifyDt,
              is_active: category.is_active,
              count: datasseeww.length,
              is_delete: category.is_delete,
            });
          }
        }
        const Resultdata = Resultsdata.sort((a, b) => b.count - a.count);

        resultSet = {
          msg: "success",
          list: Resultdata,
          statusCode: 200,
        };
      }
      return resultSet;
    } catch (Error) {
      // console.log(Error, "iiiiiiiiiiiiii");
      resultSet = {
        msg: Error,
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
async function saveBlogCategories(request, res) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    await mongoose.connect(uri);
    try {
      let ins = {};
      if (request.files) {
        uploadpath = __dirname + "/../../../uploads/BlogsCategories/";
        ins.BlogCategoryImage = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "BlogCategoryImage"
        );
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

      let insert = new BlogsCategoriesTable(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Category Created successfully",
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

async function updateBlogCategories(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      if (request.files) {
        uploadpath = __dirname + "/../../../uploads/BlogsCategories/";
        upd.BlogCategoryImage = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "BlogCategoryImage"
        );
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
      await BlogsCategoriesTable.updateMany(
        {
          _id: request.params.id,
          is_delete: false,
        },
        {
          $set: upd,
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Category updated successfully",
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
async function deleteBlogCategories(request, res) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    await mongoose.connect(uri);
    try {
      await BlogsCategoriesTable.updateMany(
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
            msg: "Category Deleted Successfully",
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
async function deleteBlogCategoriesImg(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await BlogsCategoriesTable.findById({
        _id: request.params.id,
      }).then(
        (response) => {
          if (request.body.imageName == "UploadImage") {
            uploadpath = __dirname + "/../../../uploads/BlogsCategories/";
            var filePath = uploadpath + response.UploadImage;
            var unl = fs.unlinkSync(filePath);
            let upd = {};
            upd.UploadImage = "";
            let id = mongoose.Types.ObjectId(request.params.id);
            BlogsCategoriesTable.updateMany(
              {
                _id: id,
              },
              {
                $set: upd,
              }
            )
              // BlogsCategoriesTable.updateMany({_id:request.params.id},
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
                  resultSet = {
                    msg: err.message,
                    statusCode: 500,
                  };
                  return resultSet;
                }
              );

            //return resultSet;
          } else if (request.body.imageName == "CategoryIcon") {
            uploadpath = __dirname + "/../../../uploads/BlogsCategories/";
            var filePath = uploadpath + response.CategoryIcon;
            fs.unlinkSync(filePath);
            let upd = {};
            upd.CategoryIcon = "";

            BlogsCategoriesTable.updateMany(
              {
                _id: request.params.id,
              },
              {
                $set: upd,
              }
            )
              // BlogsCategoriesTable.updateMany({_id:request.params.id},
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

// router.post("/create", authorizer, async function (req, res) {
//   const { decodeToken, user } = req.headers.user;
//   let body = new CategoryClass(req.body).getModel();
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
  deleteBlogCategoriesImg,
  getBlogCategoriesAllData,
};

// module.exports = router;
