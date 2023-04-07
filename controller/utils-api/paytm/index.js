const express = require("express");
const router = express.Router();

const pay = require("./pay");
const callback = require("./callback");

router.use("/paytm", pay);
router.use("/paytm", callback);

module.exports = router;
