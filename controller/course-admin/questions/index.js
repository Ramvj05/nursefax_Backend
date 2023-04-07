const express = require("express");
const router = express.Router();

const create = require("./create");
const list = require("./list");
const getQuestion = require("./getById");
const deleteQuestion = require("./delete");
const active = require("./active");
const inactive = require("./inactive");
const filter = require("./filter");
const search = require("./search");
const update = require("./update");
const random = require("./getRandom");
const add = require("./bulkupdate");
const remove = require("./bulkremove");
const edit = require("./edit");

router.use("/question", create);
router.use("/question", list);
router.use("/question", getQuestion);
router.use("/question", deleteQuestion);
router.use("/question", active);
router.use("/question", inactive);
router.use("/question", filter);
router.use("/question", search);
router.use("/question", update);
router.use("/question", random);
router.use("/question", add);
router.use("/question", remove);
router.use("/question", edit);

module.exports = router;
