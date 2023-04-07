const express = require("express");
const router = express.Router();
const get = require("./get");
const list = require("./list");
const generate = require("./generate");

router.use("/certificate", get);
router.use("/certificate", list);
router.use("/certificate", generate);

module.exports = router;
