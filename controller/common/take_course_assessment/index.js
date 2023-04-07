const express = require("express");
const router = express.Router();
const create = require("./create");
const addQuestion = require("./addQuestion");
const finish = require("./finish");
const get = require("./get");
const result = require("./result");
const filter = require("./filter");
const allQ = require("./getAllQuestionFromPool");
const random = require("./getRandom");
const updateStatus = require("./updateStatus");
const updateTime = require("./updateTime");
const resetLearnMode = require("./resetLearnMode");

router.use("/take-assessment", create);
router.use("/take-assessment", addQuestion);
router.use("/take-assessment", finish);
router.use("/take-assessment", get);
router.use("/take-assessment", result);
router.use("/take-assessment", filter);
router.use("/take-assessment", allQ);
router.use("/take-assessment", random);
router.use("/take-assessment", updateStatus);
router.use("/take-assessment", updateTime);
router.use("/take-assessment", resetLearnMode);

module.exports = router;
