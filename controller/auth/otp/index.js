const express = require("express");
const router = express.Router();

const create = require("./create");
const verify = require("./verify");

router.use("/otp", create);
router.use("/otp", verify);

module.exports = router;
