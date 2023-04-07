const express = require("express");
const router = express.Router();

const send = require("./send");

router.use("/email", send);

module.exports = router;
