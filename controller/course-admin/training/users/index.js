const express = require("express");
const router = express.Router();

const list = require("./list");
const getById = require("./getById");

router.use("/user", list);
router.use("/user", getById);

module.exports = router;
