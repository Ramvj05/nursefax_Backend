const express = require("express");
const router = express.Router();

const create = require("../../course-admin/subject/create");
const list = require("../../course-admin/subject/list");
const filter = require("../../course-admin/subject/filter");
const getById = require("../../course-admin/subject/getById");
const update = require("../../course-admin/subject/update");
const active = require("../../course-admin/subject/active");
const inactive = require("../../course-admin/subject/inactive");
const deleteSubject = require("../../course-admin/subject/delete");

router.use("/subject", create);
router.use("/subject", getById);
router.use("/subject", list);
router.use("/subject", filter);
router.use("/subject", update);
router.use("/subject", active);
router.use("/subject", inactive);
router.use("/subject", deleteSubject);

module.exports = router;
