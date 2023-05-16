const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/JobFilterController");

router.post("/", Controller.getJobFilterData);
router.post("/sidefilter/", Controller.postJobfilterData);

module.exports = router;
