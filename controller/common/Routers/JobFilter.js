const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/JobFilterController");

router.post("/", Controller.getJobFilterData);
router.get("/:id", Controller.getJobFilterData);
router.post("/", Controller.saveJobFilter);
router.put("/:id", Controller.updateJobFilter);
router.put("/delete/:id", Controller.deleteJobFilter);

module.exports = router;
