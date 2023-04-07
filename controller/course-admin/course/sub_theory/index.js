const express = require("express");
const router = express.Router();

const create = require("./create");
const get = require("./get");
const getByTheoryId = require("./getByTheoryId");
// const getForUserByTheoryId = require("./getForUserByTheoryId");
const list = require("./list");
const listForUser = require("./listForUser");
const deleteById = require("./delete");
const update = require("./update");

router.use("/sub-theory", create);
router.use("/sub-theory", get);
router.use("/sub-theory", getByTheoryId);
// router.use("/sub-theory", getForUserByTheoryId);
router.use("/sub-theory", list);
router.use("/sub-theory", listForUser);
router.use("/sub-theory", update);
router.use("/sub-theory", deleteById);

module.exports = router;
