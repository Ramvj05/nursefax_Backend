const express = require("express");
const mongoo = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const router = express.Router();
const LicenceModel = require("../../../model/license.model");

router.post("/check", async (req, res) => {
  try {
    await mongoo.connect(dbUri);
    const { courseId, userId } = req.body;
console.log(req.body,"req.bodyreq.bodyreq.bodyreq.bodyreq.bodyreq.body");
    // if (user.roles.includes("STUDENT")) {
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
        { studentId: userId },
        {
          deleted: false,
        },
        {
          active: true,
        },
      ],
    });

    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(200)
      .send({
        statsCode: 200,
        data: isExamPresent ? false : true,
        message: "",
        error: { message: "Check" },
      });
    // } else {
    //   res
    //     .header({
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     })
    //     .status(404)
    //     .send({
    //       statsCode: 404,
    //       data: null,
    //       message: "Do not have access to enroll this course",
    //       error: { message: "Access denied." },
    //     });
    // }
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
