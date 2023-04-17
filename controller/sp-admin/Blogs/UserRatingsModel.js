const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const UserRatingsTable = require("../../../model/BlogsModel/TableUserRatings");
const router = express.Router();
const FileHandler = require('../../../Helpers/FileHandler');


async function getUserRatingsData(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const category = {};
      if (typeof request.params.id !== 'undefined') {
        console.log("1111")
        await UserRatingsTable.findById({
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
        await UserRatingsTable.find({ is_delete: false }).then(response => {
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
async function saveUserRatings(request) {
  // console.log(request.body);

  if (request != "" && typeof request !== "undefined") {
    //console.log("request", request.files)
    const uri = dbUri;
    await mongoose.connect(uri);
    try {
      let ins = {};
      // if (request.files) {
      //   uploadpath = __dirname + '/../../../uploads/Blogs/';
      //   ins.BlogImage = await FileHandler.uploadAvatar(request, uploadpath, "BlogImage")
      // }

            ins.user_id = request.body.user_id;
            ins.blog_id = request.body.blog_id;
            ins.review_rating = request.body.review_rating;
            ins.comments = request.body.comments;
            ins.createDt = new Date(),
            ins.modifyDt = new Date();

      let insert = new UserRatingsTable(ins)
      await insert.save().then(response => {
        resultSet = {
          "msg": "Rating Created successfully",
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

async function updateUserRatings(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      upd.Status = request.body.Status;
      // upd.blog_id = request.body.blog_id;
      // upd.review_rating = request.body.review_rating;
      // upd.comments = request.body.comments;
      // upd.createDt = new Date(),
      upd.modifyDt = new Date();

      await UserRatingsTable.updateMany({
        _id: request.params.id
      }, {
        $set: upd
      })
        .then(response => {
          resultSet = {
            "msg": "Rating updated successfully",
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
async function deleteUserRatings(request) {
  console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await UserRatingsTable.updateMany({
        _id: request.params.id
      }, {
        $set: {
          is_delete: true
        }
      }).then(response => {
        resultSet = {
          "msg": "Rating Deleted Successfully",
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
async function deleteUserRatingsImg(request) {
  console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await UserRatingsTable.findById({
        _id: request.params.id
      }).then(response => {
        if (request.body.imageName == "BlogImage") {
          uploadpath = __dirname + '/../../../uploads/Blogs/';
          var filePath = uploadpath + response.BlogImage;
          var unl = fs.unlinkSync(filePath);
          let upd = {};
          upd.BlogImage = "";
          let id = mongoose.Types.ObjectId(request.params.id);
          UserRatingsTable.updateMany({
            _id: id
          }, {
            $set: upd
          })
            // UserRatingsTable.updateMany({_id:request.params.id},
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

          UserRatingsTable.updateMany({
            _id: request.params.id
          }, {
            $set: upd
          })
            // UserRatingsTable.updateMany({_id:request.params.id},
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




module.exports = {
  getUserRatingsData,
  saveUserRatings,
  updateUserRatings,
  deleteUserRatings,
  deleteUserRatingsImg
};
// module.exports = router;
