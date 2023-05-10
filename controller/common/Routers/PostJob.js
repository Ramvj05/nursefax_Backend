const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/PostJobController");

router.post("/", Controller.savePostJob);
router.post("/applyjob/", Controller.saveApplyJob);
router.get("/", Controller.getPostJobData);
router.get("/employerjob/:id", Controller.getEmployerJobData);
router.get("/:id", Controller.getPostJobData);
router.get("/appliedjob/:user_id", Controller.getPostJobData);
router.put("/:id", Controller.updatePostJob);
router.put("/active/:id", Controller.updateJobStatus);
router.put("/delete/:id", Controller.deletePostJob);

module.exports = router;
