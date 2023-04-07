const express = require("express");
const router = express.Router();

const create = require("./create");
const listByCourseId = require("./listByCourseId");
const getQuestion = require("./getById");
const deleteQuestion = require("./delete");
// const active = require("./active");
// const inactive = require("./inactive");
const update = require("./update");

router.use("/question", create);
router.use("/question", update);
router.use("/question", deleteQuestion);
router.use("/question", getQuestion);
router.use("/question", listByCourseId);
// router.use("/question", active);
// router.use("/question", inactive);

module.exports = router;
