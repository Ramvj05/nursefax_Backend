const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const PostEventTable = require("../../../model/TableCollections/TablePostEvent");
const PostEventDateTable = require("../../../model/TableCollections/TableEventDate");
const PostEventApply = require("../../../model/TableCollections/TableApplyEvent");
const FileHandler = require("../../../Helpers/FileHandler");
const { ObjectId } = require("mongodb");

var ElasticEmail = require("@elasticemail/elasticemail-client");
const userModel = require("../../../model/user.model");
var defaultClient = ElasticEmail.ApiClient.instance;
var apikey = defaultClient.authentications["apikey"];
apikey.apiKey =
  "451919C3C5CC33D2F1A86F167943B84CA768437AA96B79D75A2034072640B8CE5A30CA5A4E17A64C0736FA02C8BC800E";

async function getPostEventData(request, res) {
  // console.log("request",request);
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
          {
            $lookup: {
              from: "employers",
              localField: "createdBy",
              foreignField: "_id",
              as: "employer_details",
            },
          },
          {
            $unwind: {
              path: "$employer_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "employers",
              localField: "assignto",
              foreignField: "_id",
              as: "employer_details1",
            },
          },
          {
            $unwind: {
              path: "$employer_details1",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]).then(
          (response) => {
            // console.log("response: ", response);
            resultSet = { msg: "success", list: response, statusCode: 200 };
          },
          (err) => {
            console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500 };
          }
        );
      } else {
        // var counts= await PostEventViewTable.find({blog_id:_id}).count()

        var Resultsdata = [];
        var data = await PostEventTable.find({ is_delete: false });
        if (data.length > 0) {
          for (let events of data) {
            var countBooking = await PostEventApply.find({ is_delete: false });
            var FilterData = countBooking.filter(
              (data) =>
                data.event_id.toString() == ObjectId(events._id).toString()
            );
            Resultsdata.push({
              _id: events._id,
              name: events.name,
              eventId: events.eventId,
              heading: events.heading,
              description: events.description,
              uploadfile: events.uploadfile,
              assignto: events.assignto,
              navlink: events.navlink,
              seotitle: events.seotitle,
              seodescription: events.seodescription,
              eventlink: events.eventlink,
              eventplace: events.eventplace,
              seokeyword: events.seokeyword,
              is_delete: events.is_delete,
              createdOn: events.createdOn,
              modifyOn: events.modifyOn,
              createdBy: events.createdBy,
              active: events.active,
              count: FilterData.length,
            });
          }
        }
        // console.log("response: " + response);
        const Resultdata = Resultsdata.sort((a, b) => b.count - a.count);
        resultSet = {
          msg: "success",
          list: Resultdata,
          statusCode: 200,
        };

        (err) => {
          console.log("err: ", err);
          resultSet = {
            msg: err.message,
            statusCode: 500,
          };
        };
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
async function savePostEvent(request, res) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    const { decodeToken, user } = request.headers.user;

    await mongoose.connect(uri);
    try {
      // console.log(request.files, "request.files");
      const count = await PostEventTable.find({}).count();
      // console.log(count);
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
      // ins.description = request.body.description;
      // ins.heading = request.body.heading;
      // ins.seotitle = request.body.seotitle;
      // ins.seodescription = request.body.seodescription;
      // ins.seokeyword = request.body.seokeyword;
      ins.assignto = request.body.assignto;
      // ins.navlink = request.body.navlink;
      // ins.active = request.body.active;
      // ins.address1 = request.body.address1;
      // ins.address2 = request.body.address2;
      // ins.city = request.body.city;
      // ins.state = request.body.state;
      // ins.country = request.body.country;
      // ins.expiredOn = request.body.expiredOn;
      ins.createdBy = decodeToken.id;
      ins.createdOn = new Date();
      ins.modifyOn = new Date();
      // console.log("ins", ins);

      let insert = new PostEventTable(ins);
      await insert.save().then(
        (response) => {
          resultSet = {
            msg: "Event Created successfully",
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

      return resultSet;
    } catch (Error) {
      // console.log(Error, "ooooooooooooooo");
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
async function updatePostEvent(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const { decodeToken, user } = request.headers.user;

      const uri = dbUri;
      await mongoose.connect(uri);
      let upd = {};
      if (request.files) {
        // console.log("coming 1");
        uploadpath = __dirname + "/../../../uploads/Event/";
        upd.uploadfile = await FileHandler.uploadAvatar(
          request,
          uploadpath,
          "uploadfile"
        );
      }
      upd.name = request.body.name;
      upd.description = request.body.description;
      upd.heading = request.body.heading;
      upd.seotitle = request.body.seotitle;
      upd.seodescription = request.body.seodescription;
      upd.address1 = request.body.address1;
      upd.address2 = request.body.address2;
      upd.city = request.body.city;
      upd.state = request.body.state;
      upd.country = request.body.country;
      upd.active = request.body.active;
      upd.assignto = request.body.assignto;
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
async function deletePostEvent(request, res) {
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
async function getPostEventDateData(request, res) {
  // console.log("request", request.params.id);
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.id !== "undefined") {
        const eventid = request.params.id;
        // console.log(eventid);
        var data = await PostEventDateTable.find({
          eventid: eventid,
          is_delete: false,
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "user_id",
          //     foreignField: "_id",
          //     as: "userdetails"
          //   }
          // },
        }).then(
          (response) => {
            // console.log("response: ", response);
            resultSet = { msg: "success", list: response, statusCode: 200 };
          },
          (err) => {
            // console.log("err: ", err);
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
            // console.log("response: " + response);
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
      }

      return resultSet;
    } catch (Error) {
      // console.log("error: " + Error);
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
async function savePostEventdate(request, res) {
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
      // console.log(Error, "ooooooooooooooo");
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
async function deletePostEventDelete(request, res) {
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
async function getEmployeeEventData(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.emp_id !== "undefined") {
        const createdBy = request.params.emp_id;
        var Resultsdata = [];
        var data = await PostEventTable.find({
          is_delete: false,
          $or: [{ createdBy: createdBy }, { assignto: createdBy }],
        });
        if (data.length > 0) {
          for (let events of data) {
            var countBooking = await PostEventApply.find({ is_delete: false });
            var FilterData = countBooking.filter(
              (data) =>
                data.event_id.toString() == ObjectId(events._id).toString()
            );
            Resultsdata.push({
              _id: events._id,
              name: events.name,
              eventId: events.eventId,
              heading: events.heading,
              description: events.description,
              uploadfile: events.uploadfile,
              assignto: events.assignto,
              navlink: events.navlink,
              seotitle: events.seotitle,
              seodescription: events.seodescription,
              eventlink: events.eventlink,
              eventplace: events.eventplace,
              seokeyword: events.seokeyword,
              is_delete: events.is_delete,
              createdOn: events.createdOn,
              modifyOn: events.modifyOn,
              createdBy: events.createdBy,
              active: events.active,
              count: FilterData.length,
            });
          }
        }
        // console.log("response: ", response);
        resultSet = { msg: "success", list: Resultsdata, statusCode: 200 };

        (err) => {
          console.log("err: ", err);
          resultSet = { msg: err.message, statusCode: 500 };
        };
      } else if (typeof request.params.event_id !== "undefined") {
        const event_id = new mongoose.Types.ObjectId(request.params.event_id);
        console.log("request", request.params.event_id);
        var data = await PostEventApply.aggregate([
          {
            $match: {
              is_delete: false,
              event_id,
            },
          },

          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "user_details",
            },
          },
          {
            $unwind: {
              path: "$user_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "postevents",
              localField: "event_id",
              foreignField: "_id",
              as: "event_details",
            },
          },
          {
            $unwind: {
              path: "$event_details",
              preserveNullAndEmptyArrays: true,
            },
          },
        ]).then(
          (response) => {
            // console.log("response: ", response);
            resultSet = { msg: "success", list: response, statusCode: 200 };
          },
          (err) => {
            // console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500 };
          }
        );
      } else {
        // console.log("ooooooooooooo");
        // var counts= await PostEventViewTable.find({blog_id:_id}).count()
        var data = await PostEventTable.aggregate([
          {
            $match: {
              active: true,
              is_delete: false,
            },
          },

          {
            $lookup: {
              from: "employers",
              localField: "createdBy",
              foreignField: "_id",
              as: "employer_details",
            },
          },
          // {
          //   $lookup: {
          //     from: "postevents",
          //     localField: "createdBy",
          //     foreignField: "_id",
          //     as: "employer_details",
          //   },
          // },
        ]).then(
          (response) => {
            // console.log("response: " + response);
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
async function savePostEventApplyEvent(request, res) {
  if (request != "" && typeof request !== "undefined") {
    const uri = dbUri;
    const { decodeToken, user } = request.headers.user;
    await mongoose.connect(uri);
    try {
      var data = await PostEventApply.find({
        event_id: request.body.event_id,
        createdBy: decodeToken.id,
      });
      // if (!data.length) {
      let ins = {};
      ins.event_id = request.body.event_id;
      ins.createdBy = decodeToken.id;
      ins.createdOn = new Date();
      ins.modifyOn = new Date();
      // console.log("ins", ins);

      let insert = new PostEventApply(ins);
      await insert.save().then(
        (response) => {
          sendeventmail(response);
          // console.log(response, "iiiiiiiiiiiii");
          resultSet = {
            msg: "Event Applied successfully",
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
      // } else {
      //   resultSet = {
      //     msg: "You Already Applied This Event",
      //     statusCode: 500,
      //   };
      // }

      return resultSet;
    } catch (Error) {
      // console.log(Error, "ooooooooooooooo");
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
async function getUserEventData(request, res) {
  if (request != "" && typeof request !== "undefined") {
    try {
      const uri = dbUri;
      await mongoose.connect(uri);
      if (typeof request.params.user_id !== "undefined") {
        // console.log("request", typeof request.params.user_id !== "undefined");
        const createdBy = new mongoose.Types.ObjectId(request.params.user_id);
        var data = await PostEventApply.aggregate([
          {
            $match: {
              is_delete: false,
              createdBy: createdBy,
            },
          },

          {
            $lookup: {
              from: "postevents",
              localField: "event_id",
              foreignField: "_id",
              as: "event_details",
            },
          },
          {
            $unwind: {
              path: "$event_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "posteventdates",
              localField: "event_details._id",
              foreignField: "eventid",
              as: "eventdate_details",
            },
          },
        ]).then(
          (response) => {
            // console.log("response: ", response);
            resultSet = { msg: "success", list: response, statusCode: 200 };
          },
          (err) => {
            // console.log("err: ", err);
            resultSet = { msg: err.message, statusCode: 500 };
          }
        );
      } else {
        // console.log(new Date().toDateString());
        var data = await PostEventTable.aggregate([
          {
            $match: {
              active: true,
              is_delete: false,
              // expiredOn: { $gte: new Date() },
            },
          },
          {
            $lookup: {
              from: "employers",
              localField: "createdBy",
              foreignField: "_id",
              as: "employer_details",
            },
          },
          {
            $unwind: {
              path: "$employer_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "posteventdates",
              localField: "_id",
              foreignField: "eventid",
              as: "eventdate_details",
            },
          },
          {
            $lookup: {
              from: "applyevents",
              localField: "_id",
              foreignField: "event_id",
              as: "applied_eventsdata",
            },
          },
          {
            $unwind: {
              path: "$applied_eventsdata",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "applied_eventsdata.createdBy",
              foreignField: "_id",
              as: "userdetails",
            },
          },
        ]).then(
          (response) => {
            // console.log("response: " + response);
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
      }

      return resultSet;
    } catch (Error) {
      // console.log("error: " + Error);
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
async function sendeventmail(request, res) {
  try {
    // const { email: useremail } = req.params;
    let emailsApi = new ElasticEmail.EmailsApi();

    const uri = dbUri;
    await mongoose.connect(uri);
    const user = await userModel.findOne({
      $or: [
        {
          _id: request.createdBy,
        },
      ],
    });
    const Event = await PostEventTable.findOne({
      $or: [
        {
          _id: request.event_id,
        },
      ],
    });

    if (user) {
      const emailData = {
        Recipients: {
          To: [user.email],
        },
        Content: {
          Body: [
            {
              ContentType: "HTML",
              Charset: "utf-8",
              Content: `<html dir="ltr" lang="en" class="focus-outline-visible" lazy-loaded="true" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
							<meta charset="utf-8"> <!-- utf-8 works for most cases -->
							<meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
							<meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
							<meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
							<title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
						
							<link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700" rel="stylesheet">
						
							<!-- CSS Reset : BEGIN -->
						
						
						</head>
						
						<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
							<center style="width: 100%; background-color: #f1f1f1;">
							<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
								<div style="margin:50px auto;width:70%;padding:20px 0">
									<div style="border-bottom:1px solid #eee">
									<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">nursefax.com</a>
									</div>
									<p style="font-size:1.1em">Hi, ${user.fullName}</p>
									<p>Thank you for choosing Nursefax.<br/> NurseFax Event Deatils.<br /> ${user.email}</p>
									<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${Event.name}</h2>
									<p style="font-size:0.9em;">Regards,<br />Nursefax.com</p>
									<hr style="border:none;border-top:1px solid #eee" />
									
								</div>
								</div>
						  </center>
						</body>
					</html>`,
            },
          ],
          From: "Nursefax Support <info@nursefax.com>",
          EnvelopeFrom: "Nursefax Support <info@nursefax.com>",
          ReplyTo: "Nursefax Support <info@nursefax.com>",
          Subject: "Nursefax Event",
        },
      };
      const callback = async (error, data, response) => {
        if (error) {
          console.error(error);
          resultSet = { msg: "success", error: response, statusCode: 500 };
        } else {
          console.log("API called successfully.");
          console.log("Email sent.");

          resultSet = { msg: "success", list: response, statusCode: 200 };
        }
        return resultSet;
      };
      emailsApi.emailsTransactionalPost(emailData, callback);
    } else {
      res.status(404).send({
        statsCode: 404,
        data: null,
        message: "No user found",
        error: {},
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      statsCode: 500,
      data: null,
      message: "Somthing went wrong",
      error: err,
    });
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
  getEmployeeEventData,
  getUserEventData,
  savePostEventApplyEvent,
};

// module.exports = router;
