const express = require("express");
const router = express.Router();
const create = require("./create");
const get = require("./get");
const add = require("./add");
const remove = require("./remove");

router.use("/learning-list", create);
router.use("/learning-list", get);
router.use("/learning-list", add);
router.use("/learning-list", remove);

module.exports = router;
