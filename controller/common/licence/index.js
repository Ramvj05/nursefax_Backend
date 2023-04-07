const express = require("express");
const router = express.Router();

const buy = require("./buy");
const list = require("./list");
const getCourses = require("./getCourses");
const check = require("./check");
const listLicences = require("./listLicences");
const getLicencesById = require("./getLicenceById");
const transactions = require("./transactions");

router.use("/licence", buy);
router.use("/licence", list);
router.use("/licence", getCourses);
router.use("/licence", check);
router.use("/licence", transactions);
router.use("/licence", listLicences);
router.use("/licence", getLicencesById);

module.exports = router;
