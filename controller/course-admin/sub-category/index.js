const express = require("express");
const router = express.Router();

const create = require("../../course-admin/sub-category/create");
const list = require("../../course-admin/sub-category/list");
const getById = require("../../course-admin/sub-category/getById");
const update = require("../../course-admin/sub-category/update");
const active = require("../../course-admin/sub-category/active");
const inactive = require("../../course-admin/sub-category/inactive");
const deletesubcategory = require("../../course-admin/sub-category/delete");

router.use("/subcategory", create);
router.use("/subcategory", getById);
router.use("/subcategory", list);
router.use("/subcategory", update);
router.use("/subcategory", active);
router.use("/subcategory", inactive);
router.use("/subcategory", deletesubcategory);

module.exports = router;
