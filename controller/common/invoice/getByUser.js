const express = require("express");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const { dbUri } = require("../../../endpoints/endpoints");
// const authorizer = require("../../../middleware/authorizer");
// const InvoiceModel = require("../../../model/invoice.model");
// const { default: axios } = require("axios");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const ejs = require("ejs");
const pdf = require("html-pdf");

const router = express.Router();

router.post("/getbyuser", async function (req, res) {
  try {
    await mongoose.connect(dbUri);
    // const { decodeToken, user } = req.headers.user;
    // let body = req?.body;
    // const userLearningList = await InvoiceModel.findOne({
    //   deleted: false,
    //   userId: user._id.toString(),
    // });
    const userLearningList = false;

    if (!userLearningList) {
      const data = {
        testData: [
          {
            name: '<p><span class="T1" style="font-family:\'DevLys 010\'; margin: 0;">0-06537 esa 5 dk LFkuh; eku gS&</span></p>',
          },
        ],
      };
      try {
        const filePathName = path.resolve(__dirname, "htmltopdf.ejs");
        const htmlString = fs.readFileSync(filePathName).toString();
        let options = { format: "A4" };
        const ejsData = ejs.render(htmlString, data);
        pdf.create(ejsData, options).toStream((err, response) => {
          if (err) console.log(err);
          var s3 = new AWS.S3({
            region: "ap-southeast-1",
            accessKeyId: "AKIAQAENDR4JWZ4MI7K3",
            secretAccessKey: "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",
          });
          const uploadParams = {
            Bucket: "nursefaxbucket",
            Key: "invoice/invoice.pdf",
            ACL: "public-read-write",
            Body: response,
          };
          s3.upload(uploadParams, (err, data) => {
            if (err) {
              console.log("error", err);
              rej("");
            }
            console.log(data);
            res
              .header({
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              })
              .status(200)
              .send({
                statsCode: 200,
                data: data,
                message: "Invoice generated successfully",
                error: null,
              });
          });
        });
      } catch (err) {
        console.log("Error processing request: " + err);
      }

      //   const s3Result = axios.post({
      //     base64: data.base64Data,
      //     mimeType: data.file.type,
      //     ext: ext,
      //     fileName: fileName,
      //     path: thumbnail ? "course/sub_theory/thumbnail" : "course/sub_theory",
      //     // path:
      //   });
      //   if (s3Result) {
      //     const payload = {
      //       uri: "",
      //       data: "",
      //       userId: user._id.toString(),
      //       courseId: body.courseId,
      //       createdBy: user.fullName
      //         ? user.fullName
      //         : `${user.firstName} ${user.lastName}`,
      //     };

      //     let data;

      //     const learningList = new InvoiceModel(payload);
      //     data = await learningList.save();
      //     res
      //       .header({
      //         "Content-Type": "application/json",
      //         "Access-Control-Allow-Origin": "*",
      //       })
      //       .status(200)
      //       .send({
      //         statsCode: 200,
      //         data: data,
      //         message: "Learning list created successfully",
      //         error: null,
      //       });
      //   } else {
      //     res
      //       .header({
      //         "Content-Type": "application/json",
      //         "Access-Control-Allow-Origin": "*",
      //       })
      //       .status(400)
      //       .send({
      //         data: null,
      //         message: "Data miss matched",
      //         statsCode: 400,
      //         error: {
      //           message: "Access denied",
      //         },
      //       });

      //   }
    } else {
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(401)
        .send({
          data: null,
          message: "You cannot generate more than one invoice of same course",
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
