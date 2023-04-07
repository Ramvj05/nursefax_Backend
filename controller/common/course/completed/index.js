const express = require("express");
const router = express.Router();
const assessment = require("./assessment");
const theory = require("./theory");

router.use("/completed", assessment);
router.use("/completed", theory);

module.exports = router;
