const express = require("express");
const router = express.Router();

const create = require("./create");
const list = require("./list");
const getById = require("./getById");
const update = require("./update");
const active = require("./active");
const inactive = require("./inactive");
const filter = require("./filter");
const deleteCategory = require("./delete");

router.use("/category", create);
router.use("/category", getById);
router.use("/category", list);
router.use("/category", filter);
router.use("/category", update);
router.use("/category", active);
router.use("/category", inactive);
router.use("/category", deleteCategory);

module.exports = router;
