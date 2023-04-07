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

router.use("/post", create);
router.use("/post", getById);
router.use("/post", list);
router.use("/post", filter);
router.use("/post", update);
router.use("/post", active);
router.use("/post", inactive);
router.use("/post", deleteCategory);

module.exports = router;
