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
router.use("/community", create);
router.use("/community", getById);
router.use("/community", list);
router.use("/community", filter);
router.use("/community", update);
router.use("/community", active);
router.use("/community", inactive);
router.use("/community", deleteCategory);

module.exports = router;
