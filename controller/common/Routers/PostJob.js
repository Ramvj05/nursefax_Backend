const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/PostJobController");
const app = express();
const ApplyJobTable = require("../../../model/TableCollections/TableApplyJob");

router.get("/", Controller.getPostJobData);
router.get("/:id", Controller.getPostJobData);
router.post("/", Controller.savePostJob);
router.post("/applyjob/", Controller.saveApplyJob);
router.post("/applyjob/:id", Controller.saveApplyJob);
router.put("/:id", Controller.updatePostJob);
router.put("/delete/:id", Controller.deletePostJob);

router.get("/employerjob/:emp_id", Controller.getEmployerJobData);
router.get("/employerjob/job/:job_id", Controller.getEmployerJobData);
router.get("/appliedjob/:user_id", Controller.getPostJobData);
router.put("/active/:id", Controller.updateJobStatus);
router.get("/download/:id", Controller.getDownloaded);

module.exports = router;
