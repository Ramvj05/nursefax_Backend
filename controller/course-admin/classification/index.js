const express = require("express");
const router = express.Router();

const theory = require("./theory");

router.use("/classification", theory);

module.exports = router;
