const express = require("express");
const router = express.Router();
const create = require("./create");
const deletePool = require("./delete");
const list = require("./list");
const removed = require("./removed");
const approved = require("./approved");
const rejected = require("./rejected");
const update = require("./update");

router.use("/exam", create);
router.use("/exam", approved);
router.use("/exam", removed);
router.use("/exam", rejected);
router.use("/exam", list);
router.use("/exam", deletePool);
router.use("/exam", update);

module.exports = router;
