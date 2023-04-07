const express = require("express");
const router = express.Router();

const post = require("./post");

router.use("/jobs", post);

module.exports = router;
