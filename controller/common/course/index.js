const express = require("express");
const router = express.Router();
// const certificate = require("./certificate");
// const completed = require("./completed");
const finish = require("./finish");

// router.use("/course", certificate);
// router.use("/course", completed);
router.use("/course", finish);

module.exports = router;
