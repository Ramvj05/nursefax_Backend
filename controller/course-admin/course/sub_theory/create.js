const mongoose = require("mongoose");
const express = require("express");
const SubTheoryClass = require("../../../../class/sub_theory.class");
const courseTheorymodel = require("../../../../model/sub_theory.model");
const authorizer = require("../../../../middleware/authorizer");
const { dbUri } = require("../../../../endpoints/endpoints");
const router = express.Router();

router.post("/create", authorizer, async (req, res) => {
  try {
    const { decodeToken } = req.headers.user;
    let body = new SubTheoryClass(req.body).getModel();
    // let body = req.body;
    console.log("bodyyyyyyy--------", body);

    await mongoose.connect(dbUri);

    let count = await courseTheorymodel.find({ deleted: false }).count();

    let thid;
    if (count < 10) {
      thid = `STHID-00000${count + 1}`;
    } else if (count < 100) {
      thid = `STHID-0000${count + 1}`;
    } else if (count < 1000) {
      thid = `STHID-000${count + 1}`;
    } else if (count < 10000) {
      thid = `STHID-00${count + 1}`;
    } else if (count < 100000) {
      thid = `STHID-0${count + 1}`;
    } else {
      thid = `STHID-${count + 1}`;
    }
    body = {
      ...body,
      createdBy: decodeToken.id,
      subTheoryId: thid,
    };

    // if (user.roles.includes("CREATE_THEORY") || user.roles.includes("ADMIN")) {
    const newTheoryModel = new courseTheorymodel(body);
    const data = await newTheoryModel.save();
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(200)
      .send({
        data: data,
        message: "Theory Created Successfully",
        statsCode: 200,
        error: null,
      });
    // } else {
    //   res
    //     .header({
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     })
    //     .status(401)
    //     .send({
    //       data: null,
    //       message: "You do not have access to create Theory",
    //       statsCode: 401,
    //       error: {
    //         message: "Access denied",
    //       },
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
