const express = require("express");
const router = express.Router();

const theory = require("./theory");
const subTheory = require("./sub_theory");
const assessment = require("./assessments");
const certificate = require("./certificate");

router.use("/course", theory);
router.use("/course", subTheory);
router.use("/course", assessment);
router.use("/course", certificate);
// router.use("/course", assessmentQuestions);

module.exports = router;

// title, description, passing percentage, number of attemp, question
