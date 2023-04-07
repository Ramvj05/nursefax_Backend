const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { dbUri } = require("../endpoints/endpoints");
const courseAdminModel = require("../model/courseAdmin.model");
const { generateSalt, generateHash } = require("../utils/encrypt");

router.get("/update-user-password/:id", async (req, res) => {
  mongoose.connect(dbUri);
  console.log("req.params.id-->", req.params.id);
  const csadmin = await courseAdminModel.findOne({ _id: req.params.id });
  console.log("csadmin-->", csadmin);
  try {
    let salt = generateSalt();
    let hash = generateHash(csadmin.password, salt);
    let r = await courseAdminModel.findByIdAndUpdate(
      req.params.id,
      { password: hash },
      { new: true }
    );
    res.send({
      data: x,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
