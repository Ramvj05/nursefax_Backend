const express = require("express");
const router = express.Router();

const create = require("../../course-admin/micro-class/create");
const list = require("../../course-admin/micro-class/list");
const getById = require("../../course-admin/micro-class/getById");
const update = require("../../course-admin/micro-class/update");
const active = require("../../course-admin/micro-class/active");
const inactive = require("../../course-admin/micro-class/inactive");
const deletemicroclass = require("../../course-admin/micro-class/delete");

router.use("/microclass", create);
router.use("/microclass", getById);
router.use("/microclass", list);
router.use("/microclass", update);
router.use("/microclass", active);
router.use("/microclass", inactive);
router.use("/microclass", deletemicroclass);

module.exports = router;
