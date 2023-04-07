const express = require("express");
const router = express.Router();

const update = require("./update");
const getProfile = require("./get");

router.use("/profile", update);
router.use("/profile", getProfile);

module.exports = router;
