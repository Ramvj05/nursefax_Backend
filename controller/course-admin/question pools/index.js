const express = require("express");
const router = express.Router();

const create = require("./create");
const get = require("./get");
const list = require("./list");
const filter = require("./filter");

const deletePool = require("./delete");
const active = require("./active");
const inactive = require("./inactive");
const update = require("./update");
const getAllQuestions = require("./getAllQuestionFromPool");

router.use("/question-pool", create);
router.use("/question-pool", get);
router.use("/question-pool", list);
router.use("/question-pool", filter);

router.use("/question-pool", deletePool);
router.use("/question-pool", active);
router.use("/question-pool", inactive);
router.use("/question-pool", update);
router.use("/question-pool", getAllQuestions);
module.exports = router;
