const express = require('express');
const router = express.Router();
const Controller = require("../../Controllers/PostJobController");;

router.get("/", Controller.getPostJobData);
router.get("/:id", Controller.getPostJobData);
router.get("/appliedjob/:user_id", Controller.getPostJobData);
router.post("/", Controller.savePostJob);
router.post("/applyjob/", Controller.saveApplyJob);
router.put("/:id", Controller.updatePostJob);
router.put("/active/:id", Controller.updateJobStatus);
router.put("/delete/:id", Controller.deletePostJob);

module.exports = router;