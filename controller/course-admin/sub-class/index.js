const express = require("express");
const router = express.Router();

const create = require("../../course-admin/sub-class/create");
const list = require("../../course-admin/sub-class/list");
const getById = require("../../course-admin/sub-class/getById");
const update = require("../../course-admin/sub-class/update");
const active = require("../../course-admin/sub-class/active");
const inactive = require("../../course-admin/sub-class/inactive");
const deletesubclass = require("../../course-admin/sub-class/delete");

router.use("/subclass", create);
router.use("/subclass", getById);
router.use("/subclass", list);
router.use("/subclass", update);
router.use("/subclass", active);
router.use("/subclass", inactive);
router.use("/subclass", deletesubclass);

module.exports = router;
