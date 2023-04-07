const express = require("express");
const router = express.Router();

const status = require("./status");
// const get = require("./get");

router.use("/certificate", status);
// router.use("/certificate", get);

module.exports = router;
