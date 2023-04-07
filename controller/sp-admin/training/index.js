const express = require("express");
const router = express.Router();
const create = require("./create");
const list = require("./list");
const get = require("./getById");
const update = require("./update");
const deleteTraining = require("./delete");
const active = require("./active");
const inactive = require("./inactive");
const approved = require("./approvedTest");
const approvedDelete = require("./approvedDelete");

router.use("/training", create);
router.use("/training", list);
router.use("/training", update);
router.use("/training", active);
router.use("/training", inactive);
router.use("/training", get);
router.use("/training", deleteTraining);
router.use("/training", approved);
router.use("/training", approvedDelete);

module.exports = router;
