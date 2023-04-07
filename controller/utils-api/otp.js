const express = require("express");
const router = express.Router();

const send = require("./otp/sendOtp");
const verify = require("./otp/verifyOtp");

router.use("/otp", send);
router.use("/otp", verify);

module.exports = router;
