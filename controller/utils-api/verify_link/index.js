const express = require("express");
const router = express.Router();

const send = require("./send");

router.use("/verify-link", send);

module.exports = router;
