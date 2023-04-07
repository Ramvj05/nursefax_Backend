const express = require("express");
const router = express.Router();

const filter = require("./filter");
const get = require("./get");

router.use("/transactions", filter);
router.use("/transactions", get);

module.exports = router;
