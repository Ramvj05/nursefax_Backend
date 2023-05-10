const express = require("express");
const router = express.Router();

const send = require("./send");
const empsend = require("./empsend");

router.use("/verify-link", send);
router.use("/verify-link", empsend);

module.exports = router;
