const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/JobFilterController");

router.post("/", Controller.getJobFilterData);
router.post("/sidefilter/", Controller.postJobfilterData);
router.get("/getjobcount/:id", Controller.getDashboardCount);
router.get("/geteventcount/:emp_id", Controller.getDashboardCount);
router.get("/candidatelist/:empl_id", Controller.getCandidatelist);
router.post("/cronjob/", Controller.getCandidatelist);

module.exports = router;
