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

router.use("/do-exam", create);
router.use("/do-exam", addQuestion);
router.use("/do-exam", finish);
router.use("/do-exam", get);
router.use("/do-exam", result);
router.use("/do-exam", filter);
router.use("/do-exam", allQ);
router.use("/do-exam", random);
router.use("/do-exam", updateStatus);
router.use("/do-exam", updateTime);
router.use("/do-exam", resetLearnMode);

module.exports = router;
