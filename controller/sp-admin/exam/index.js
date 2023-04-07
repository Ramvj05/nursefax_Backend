const express = require("express");
const router = express.Router();
const create = require("./create");
const list = require("./list");
const get = require("./getById");
const update = require("./update");
const deletetest = require("./delete");
const active = require("./active");
const inactive = require("./inactive");
const approved = require("./approvedTest");
const approvedDelete = require("./approvedDelete");

router.use("/exam", create);
router.use("/exam", list);
router.use("/exam", update);
router.use("/exam", active);
router.use("/exam", inactive);
router.use("/exam", get);
router.use("/exam", deletetest);
router.use("/exam", approved);
router.use("/exam", approvedDelete);

module.exports = router;
