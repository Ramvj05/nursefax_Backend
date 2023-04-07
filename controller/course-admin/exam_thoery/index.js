const express = require("express");
const router = express.Router();

const create = require("./create");
const get = require("./get");
const getByExamId = require("./getByExamId");
const list = require("./list");
const deleteById = require("./delete");
const update = require("./update");

router.use("/theory", create);
router.use("/theory", get);
router.use("/theory", getByExamId);
router.use("/theory", list);
router.use("/theory", update);
router.use("/theory", deleteById);

module.exports = router;
