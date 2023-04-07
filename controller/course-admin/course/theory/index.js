const express = require("express");
const router = express.Router();

const create = require("./create");
const get = require("./get");
const getByCourseId = require("./getByCourseId");
const list = require("./list");
const listByUser = require("./listByUser");
const deleteById = require("./delete");
const update = require("./update");

router.use("/theory", create);
router.use("/theory", get);
router.use("/theory", getByCourseId);
router.use("/theory", list);
router.use("/theory", listByUser);
router.use("/theory", update);
router.use("/theory", deleteById);

module.exports = router;
