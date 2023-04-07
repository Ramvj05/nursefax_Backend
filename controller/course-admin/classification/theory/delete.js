const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const authorizer = require("../../../../middleware/authorizer");
const TheoryClassificationModel = require("../../../../model/classification/theory.model");
const ThoeryModel = require("../../../../model/theory.model");
const router = express.Router();

router.delete("/delete/:id", authorizer, async function (req, res) {
  const { user } = req.headers.user;
  const { id } = req.params;
  const uri = dbUri;
  await mongoose.connect(uri);

  try {
    if (
      user.roles.includes("MODIFY_CATEGORY") ||
      user.roles.includes("ADMIN")
    ) {
      const exam = await ThoeryModel.find({
        category: { $all: [id] },
      });

      if (exam && exam.length === 0) {
        const category = await TheoryClassificationModel.findOneAndUpdate(
          {
            deleted: false,
            _id: id,
          },
          { deleted: true },
          {
            new: true,
          }
        );

        console.log(category);
        if (category) {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              data: category,
              message: "category modified successfully",
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
              message: "category Not Found",
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
            message:
              "You cannot delete Category, it is bind with some resources, You need to unbind the resources first",
            // handler: [
            // 	{
            // 		resources: exam.map((ele) => ({
            // 			name: ele.topic,
            // 			id: ele["_id"],
            // 			type: "Question Pool",
            // 		})),
            // 	},
            // ],
            statsCode: 401,
            error: {
              message: "Access denied",
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
          message: "You do not have access to modilfy category",
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
});

module.exports = router;
