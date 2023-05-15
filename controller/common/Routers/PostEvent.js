const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/PostEventController");

router.get("/usereventdata/", Controller.getUserEventData);
router.get("/", Controller.getPostEventData);
router.get("/:id", Controller.getPostEventData);
router.post("/", Controller.savePostEvent);
router.put("/:id", Controller.updatePostEvent);
router.put("/delete/:id", Controller.deletePostEvent);
router.post("/applyevent/", Controller.savePostEventApplyEvent);

router.post("/eventdate/", Controller.savePostEventdate);
router.put("/eventdate/delete/:id", Controller.deletePostEventDelete);
router.get("/eventdate/:id", Controller.getPostEventDateData);

router.get("/employerevent/:id", Controller.getEmployeeEventData);
router.get(
  "/employerevent/eventdata/:event_id",
  Controller.getEmployeeEventData
);
module.exports = router;
