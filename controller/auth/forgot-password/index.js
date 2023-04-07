const express = require("express");
const router = express.Router();

const mail = require("./sendmail");
const reset = require("./resetPassword");

router.use("/forget-password", mail);
router.use("/forget-password", reset);

module.exports = router;
