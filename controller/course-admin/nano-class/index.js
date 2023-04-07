const express = require("express");
const router = express.Router();

const create = require("./create");
const list = require("./list");
const getById = require("./getById");
const update = require("./update");
const active = require("./active");
const inactive = require("./inactive");
const deletenanoclass = require("./delete");

router.use("/nanoclass", create);
router.use("/nanoclass", getById);
router.use("/nanoclass", list);
router.use("/nanoclass", update);
router.use("/nanoclass", active);
router.use("/nanoclass", inactive);
router.use("/nanoclass", deletenanoclass);

module.exports = router;
