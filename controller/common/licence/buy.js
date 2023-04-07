const express = require("express");
const mongoo = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();
const LicenceModel = require("../../../model/license.model");
const examModel = require("../../../model/test.model");
const courseModel = require("../../../model/course.model");
const trainingModel = require("../../../model/training.model");
const transactionsModel = require("../../../model/transactions.model");
const User = require("../../../model/user.model");

router.post("/buy", async (req, res) => {
  try {
    await mongoo.connect(dbUri);
    const user = await User.findOne(
      {
        deleted: false,
        _id: req.body.userId,
      },
      {
        password: 0,
      }
    );
    delete user.password;
    const {
      courseId,
      type,
      paymentMethod,
      paymentDetails,
      paymentStatus,
      paidAmount,
      orderId,
    } = req.body;

    const sModel =
      type === "TRAINING"
        ? trainingModel
        : type === "COURSE"
        ? courseModel
        : examModel;

    if (user.roles.includes("STUDENT")) {
      const isExamPresent = await LicenceModel.findOne({
        $or: [
          {
            courseId: courseId,
          },
          {
            examId: courseId,
          },
        ],
        $and: [
          { studentId: user.id },
          {
            deleted: false,
          },
        ],
      });

      if (!isExamPresent) {
        const course = await sModel.findOne({ _id: courseId, deleted: false });
        if (course) {
          if (paymentStatus === "SUCCESS") {
            const tsPayload = {
              userId: user.id,
              user,
              user,
              courseId,
              courseType: course.type,
              paymentMethod,
              paymentDetails,
              paymentStatus,
              paidAmount,
              orderId,
              coursePrice: course.price,
            };
            const transactionsDataModel = new transactionsModel(tsPayload);
            const tResult = await transactionsDataModel.save();

            var d = new Date();
            d.setMonth(d.getMonth() + 3);
            const expiredOn = d.toISOString();

            const payload = {
              transactionId: tResult?._id,
              studentId: user.id,
              courseId,
              type: course.type,
              paymentMethod,
              paymentDetails,
              paymentStatus,
              paidAmount,
              orderId,
              coursePrice: course.price,
              expiredOn,
            };
            const licenceDataModel = new LicenceModel(payload);
            let data = await licenceDataModel.save();
            res
              .header({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              })
              .status(200)
              .send({
                statsCode: 200,
                data: { ...data["_doc"], course },
                message: "Payment success.",
                error: null,
              });
          } else {
            const payload = {
              userId: user.id,
              user,
              user,
              courseId,
              courseType: course.type,
              paymentMethod,
              paymentDetails,
              paymentStatus,
              paidAmount,
              orderId,
              coursePrice: course.price,
            };
            const transactionsDataModel = new transactionsModel(payload);
            let data = await transactionsDataModel.save();
            res
              .header({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              })
              .status(404)
              .send({
                statsCode: 404,
                data: { ...data["_doc"], course },
                message: "Payment Failed",
                error: null,
              });
          }
        } else {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(400)
            .send({
              statsCode: 400,
              data: null,
              message: "Course not found.",
              error: { message: "Not Found." },
            });
        }
      } else {
        res
          .header({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          })
          .status(500)
          .send({
            statsCode: 500,
            data: null,
            message: "Course already bought",
            error: { message: "Already exist." },
          });
      }
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(404)
        .send({
          statsCode: 404,
          data: null,
          message: "Do not access to buy this course",
          error: { message: "Access denied." },
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
});

module.exports = router;
