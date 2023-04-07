const express = require("express");
const router = express.Router();

const create = require("./create");
const get = require("./get");
const getByCourseId = require("./getByCourseId");
const getByCourseIdForUser = require("./getByCourseIdForUser");
// const list = require("./list");
const deleteById = require("./delete");
const update = require("./update");
const assessmentQuestions = require("../assessment_questions");

router.use("/assessment", create);
router.use("/assessment", get);
router.use("/assessment", getByCourseId);
router.use("/assessment", getByCourseIdForUser);
// router.use("/assessment", list);
router.use("/assessment", update);
router.use("/assessment", deleteById);
router.use("/assessment", assessmentQuestions);

module.exports = router;
