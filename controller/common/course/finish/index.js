const express = require("express");
const router = express.Router();
const theory = require("./theory");
const subTheory = require("./sub_theory");

router.use("/finish", theory);
router.use("/finish", subTheory);

module.exports = router;
