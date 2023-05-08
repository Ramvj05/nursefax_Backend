const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const PostEventTable = require("../../../model/TableCollections/TablePostEvent");
const PostEventDateTable = require("../../../model/TableCollections/TableEventDate");
const FileHandler = require("../../../Helpers/FileHandler");

async function getPostEventData(request) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(request.params.id);
        var data = await PostEventTable.aggregate([
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
        // var counts= await PostEventViewTable.find({blog_id:_id}).count()
        var data = await PostEventTable.aggregate([
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
async function savePostEvent(request) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    const { decodeToken, user } = request.headers.user;

    await mongoose.connect(uri);
    try {
      // console.log(request.files, "request.files");
      const count = await PostEventTable.find({}).count();
      console.log(count);
      let eventId;
      if (count < 10) {
        eventId = `EVENT-00000${count + 1}`;
      } else if (count < 100) {
        eventId = `EVENT-0000${count + 1}`;
      } else if (count < 1000) {
        eventId = `EVENT-000${count + 1}`;
      } else if (count < 10000) {
        eventId = `EVENT-00${count + 1}`;
      } else if (count < 100000) {
        eventId = `EVENT-0${count + 1}`;
      } else {
        eventId = `EVENT-${count + 1}`;
      }
      let ins = {};
      if (request.files) {
        uploadpath = __dirname + "/../../../uploads/Event/";
        // console.log(uploadpath, "uploadpath");
        ins.uploadfile = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "uploadfile"
        );
      }
      ins.name = request.body.name;
      ins.eventId = eventId;
      ins.description = request.body.description;
      ins.heading = request.body.heading;
      ins.seotitle = request.body.seotitle;
      ins.seodescription = request.body.seodescription;
      ins.seokeyword = request.body.seokeyword;
      ins.navlink = request.body.navlink;
      ins.expiredOn = request.body.expiredOn;
      ins.createdBy = decodeToken.id;
      ins.createdOn = new Date();
      ins.modifyOn = new Date();
      // console.log("ins", ins);

      let insert = new PostEventTable(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Event Created successfully",
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
async function updatePostEvent(request) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const { decodeToken, user } = request.headers.user;

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
      upd.name = request.body.name;
      upd.eventId = eventId;
      upd.description = request.body.description;
      upd.heading = request.body.heading;
      upd.seotitle = request.body.seotitle;
      upd.seodescription = request.body.seodescription;
      upd.seokeyword = request.body.seokeyword;
      upd.navlink = request.body.navlink;
      upd.expiredOn = request.body.expiredOn;
      upd.createdBy = decodeToken.id;
      upd.modifyOn = new Date();

      await PostEventTable.updateMany(
        {
          _id: request.params.id,
        },
        {
          $set: upd,
        }
      ).then(
        (response) => {
          resultSet = {
            msg: "Event updated successfully",
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
async function deletePostEvent(request) {
  // console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await PostEventTable.updateMany(
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
            msg: "Event Deleted Successfully",
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
async function getPostEventDateData(request) {
  //console.log("request",request);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const _id = new mongoose.Types.ObjectId(request.params.id);
        var data = await PostEventDateTable.aggregate([
          {
            $match: {
              eventid,
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
        // var counts= await PostEventViewTable.find({blog_id:_id}).count()
        var data = await PostEventDateTable.aggregate([
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
async function savePostEventdate(request) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    const { decodeToken, user } = request.headers.user;
    await mongoose.connect(uri);
    try {
      let ins = {};
      ins.eventdate = request.body.eventdate;
      ins.eventtime = request.body.eventtime;
      ins.eventid = request.body.eventid;
      ins.createdBy = decodeToken.id;
      ins.createdOn = new Date();
      ins.modifyOn = new Date();
      // console.log("ins", ins);

      let insert = new PostEventDateTable(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Event Date Created successfully",
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
async function deletePostEventDelete(request) {
  // console.log(request.body);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      await PostEventDateTable.updateMany(
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
            msg: "EventDate Deleted Successfully",
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
  getPostEventData,
  savePostEvent,
  updatePostEvent,
  deletePostEvent,
  savePostEventdate,
  deletePostEventDelete,
  getPostEventDateData,
};

// module.exports = router;