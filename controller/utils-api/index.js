const express = require("express");
const router = express.Router();

const uploadMedia = require("./upload-media");
const deleteMedia = require("./deleteMedia");
const roles = require("./roles");
const otp = require("./otp");
const paytm = require("./paytm");
const email = require("./email");
const stripepay = require("./stripepay");
const stripepaycheck = require("./stripepaycheck");
const verifyLink = require("./verify_link");

router.use("/utils", uploadMedia);
router.use("/utils", roles);
router.use("/utils", deleteMedia);
router.use("/utils", otp);
router.use("/utils", paytm);
router.use("/utils", verifyLink);
router.use("/utils", stripepay);
router.use("/utils", stripepaycheck);
router.use("/utils", email);

module.exports = router;
