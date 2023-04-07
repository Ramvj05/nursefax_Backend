const express = require("express");
const router = express.Router();

const create = require("./create");
const list = require("./list");
const getById = require("./getById");
const update = require("./update");
const active = require("./active");
const inactive = require("./inactive");
const filter = require("./filter");
const deleteTheory = require("./delete");

router.use("/theory", create);
router.use("/theory", getById);
router.use("/theory", list);
router.use("/theory", filter);
router.use("/theory", update);
router.use("/theory", active);
router.use("/theory", inactive);
router.use("/theory", deleteTheory);

module.exports = router;
