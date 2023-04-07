const express = require("express");
const router = express.Router();

const create = require("./create");
const get = require("./get");
const getMock = require("./getMock");
const list = require("./list");
const update = require("./update");
const deleteMock = require("./delete");
const addQuestion = require("./addQuestionInSection");
const finish = require("./finish");
const result = require("./result");
const getAll = require("./getAllresult");

router.use("/mocktest", create);
router.use("/mocktest", get);
router.use("/mocktest", getMock);
router.use("/mocktest", list);
router.use("/mocktest", update);
router.use("/mocktest", deleteMock);
router.use("/mocktest", addQuestion);
router.use("/mocktest", finish);
router.use("/mocktest", result);
router.use("/mocktest", getAll);

module.exports = router;
