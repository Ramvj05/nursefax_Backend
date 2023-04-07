const express = require("express");
const router = express.Router();
const create = require("./create");
const deleteCard = require("./delete");
const list = require("./list");
const get = require("./get");
const update = require("./update");
const pin = require("./pin");
router.use("/notes", create);
router.use("/notes", get);
router.use("/notes", list);
router.use("/notes", deleteCard);
router.use("/notes", update);
router.use("/notes", pin);

module.exports = router;
