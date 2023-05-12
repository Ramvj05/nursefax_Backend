const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/PostJobController");
const app = express();
const ApplyJobTable = require("../../../model/TableCollections/TableApplyJob");

router.post("/", Controller.savePostJob);
router.post("/applyjob/", Controller.saveApplyJob);
router.post("/applyjob/:id", Controller.saveApplyJob);
router.get("/", Controller.getPostJobData);
router.get("/employerjob/:id", Controller.getEmployerJobData);
router.get("/employerjob/job/:job_id", Controller.getEmployerJobData);
router.get("/:id", Controller.getPostJobData);
router.get("/appliedjob/:user_id", Controller.getPostJobData);
router.put("/:id", Controller.updatePostJob);
router.put("/active/:id", Controller.updateJobStatus);
router.put("/delete/:id", Controller.deletePostJob);

app.get("/download/:id", (req, res) => {
  ApplyJobTable.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var path = "../../../uploads/" + data[0].uploadfile;
      res.download(path);
    }
  });
});

module.exports = router;
