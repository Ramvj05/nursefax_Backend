const express = require("express");
const router = express.Router();
// const download = require("./download");
const generate = require("./generate");
// const getByUser = require("./getByUser");

// router.use("/invoice", download);
router.use("/invoice", generate);
// router.use("/invoice", getByUser);

module.exports = router;
