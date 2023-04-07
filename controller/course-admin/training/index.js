const express = require("express");
const router = express.Router();

const users = require("./users");

router.use("/training", users);

module.exports = router;
