const express = require("express");
const router = express.Router();
const create = require("./create");
const list = require("./list");
const get = require("./getById");
const update = require("./update");
const deleteCourse = require("./delete");
const active = require("./active");
const inactive = require("./inactive");
const approved = require("./approvedTest");
const approvedDelete = require("./approvedDelete");

router.use("/course", create);
router.use("/course", list);
router.use("/course", update);
router.use("/course", active);
router.use("/course", inactive);
router.use("/course", get);
router.use("/course", deleteCourse);
router.use("/course", approved);
router.use("/course", approvedDelete);

module.exports = router;
