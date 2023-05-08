const express = require("express");
const mongoose = require("mongoose");
const CategoryClass = require("../../../class/admin/course_category.class");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const EmployersTable = require("../../../model/TableCollections/TableEmployers");
const FileHandler = require("../../../Helpers/FileHandler");

async function getEmployersData(request) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(request.params.id);
        var data = await EmployersTable.aggregate([
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
      } else {
        // var counts= await EmployersViewTable.find({blog_id:_id}).count()
        var data = await EmployersTable.aggregate([
          {
            $match: {
              is_delete: false,
            },
          },
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

async function saveEmployers(request) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    await mongoose.connect(uri);
    if (user.roles.includes("ADMIN") || user.roles.includes("EMPLOYER")) {
      try {
        const { decodeToken, user } = req.headers.user;

        // console.log(request.files, "request.files");
        const data = request.body;
        let ins = {};
        if (request.files) {
          uploadpath = __dirname + "/../../../uploads/Employers/";
          ins.picture = await FileHandler.uploadAvatar(
            request,
            uploadpath,
            "picture"
          );
        }
        ins.fullName = data.fullName;
        ins.userName = data.userName;
        ins.mobile = data.mobile;
        ins.hospitalname = data.hospitalname;
        ins.bussinessname = data.bussinessname;
        ins.companycantact = data.companycantact;
        ins.website = data.website;
        ins.gstregno = data.gstregno;
        ins.about = data.about;
        ins.companyemail = data.companyemail;
        ins.email = data.email;
        ins.password = data.password;
        ins.mcc = data.mcc;
        ins.active = data.active;
        ins.country = data.country;
        ins.Address = data.Address;
        ins.userType = data.userType;
        ins.createdBy = decodeToken.id;
        ins.createdOn = new Date();
        ins.modifyOn = new Date();

        let insert = new EmployersTable(ins);
        await insert.save().then(
          (response) => {
            resultSet = {
              msg: "Employer Created successfully",
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
        msg: "You Don't have access to this",
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

async function updateEmployers(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const { decodeToken, user } = request.headers.user;
      const uri = dbUri;
      await mongoose.connect(uri);
      if (user.roles.includes("ADMIN") || user.roles.includes("EMPLOYER")) {
      } else {
      }
      const data = request.body;
      let upd = {};
      if (request.files) {
        uploadpath = __dirname + "/../../../uploads/Employers/";
        ins.picture = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "picture"
        );
      }
      upd.fullName = data.fullName;
      upd.userName = data.userName;
      upd.mobile = data.mobile;
      upd.hospitalname = data.hospitalname;
      upd.bussinessname = data.bussinessname;
      upd.companycantact = data.companycantact;
      upd.website = data.website;
      upd.gstregno = data.gstregno;
      upd.about = data.about;
      upd.active = data.active;
      upd.companyemail = data.companyemail;
      upd.email = data.email;
      upd.mcc = data.mcc;
      upd.password = data.password;
      upd.country = data.country;
      upd.Address = data.Address;
      upd.userType = data.userType;
      upd.createdBy = decodeToken.id;
      upd.modifyOn = new Date();

      await EmployersTable.updateMany(
        {
          _id: request.params.id,
        },
        {
          $set: upd,
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Employer updated successfully",
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
      console.log(Error, "Error");
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
async function deleteEmployers(request) {
  // console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await EmployersTable.updateMany(
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
            msg: "Employer Deleted Successfully",
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
async function deleteEmployersImg(request) {
  // console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await EmployersTable.findById({
        _id: request.params.id,
      }).then(
        (response) => {
          if (request.body.imageName == "picture") {
            uploadpath = __dirname + "/../../../uploads/Employers/";
            var filePath = uploadpath + response.picture;
            var unl = fs.unlinkSync(filePath);
            let upd = {};
            upd.picture = "";
            let id = mongoose.Types.ObjectId(request.params.id);
            EmployersTable.updateMany(
              {
                _id: id,
              },
              {
                $set: upd,
              }
            )
              // EmployersTable.updateMany({_id:request.params.id},
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
          } else if (request.body.imageName == "picture") {
            uploadpath = __dirname + "/../../../uploads/Employers/";
            var filePath = uploadpath + response.CategoryIcon;
            fs.unlinkSync(filePath);
            let upd = {};
            upd.picture = "";

            EmployersTable.updateMany(
              {
                _id: request.params.id,
              },
              {
                $set: upd,
              }
            )
              // EmployersTable.updateMany({_id:request.params.id},
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
async function updateEmployerStatus(req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const data = req.body;
  const uri = dbUri;
  await mongoose.connect(uri);
  if (user.roles.includes("ADMIN")) {
    try {
      const updatedstatus = await EmployersTable.findOneAndUpdate(
        {
          is_delete: false,
          _id: id,
        },
        { $set: { status: data.Status } }
      ).then(
        (response) => {
          resultSet = {
            msg: "Employer Approved Updated successfully",
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
async function updateEmployerProfile(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      const data = request.body;
      let upd = {};
      upd.fullName = data.fullName;
      upd.userName = data.userName;
      upd.password = data.password;
      upd.mobile = data.mobile;
      upd.email = data.email;
      upd.emailVerified = data.emailVerifired;
      upd.active = data.active;
      upd.mobileVerified = data.mobileVerified;
      upd.mcc = data.mcc;
      upd.country = data.country;
      upd.modifyOn = new Date();

      await EmployersTable.updateMany(
        {
          _id: request.params.id,
        },
        {
          $set: upd,
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Employer Profile updated successfully",
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
      console.log(Error, "Error");
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
  getEmployersData,
  saveEmployers,
  updateEmployers,
  deleteEmployers,
  deleteEmployersImg,
  updateEmployerStatus,
  updateEmployerProfile,
};

// module.exports = router;
