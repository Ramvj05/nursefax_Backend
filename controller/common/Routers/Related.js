const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/RelatedController");

router.post("/saveratings/", Controller.saveRatings);
router.get("/course/:id", Controller.getCourseRealted);
router.get("/job/:id", Controller.getJobRelated);
router.get("/rating/", Controller.getRatings);
router.get("/rating/:id", Controller.getRatings);
router.put("/rating/delete/:id", Controller.deleteRatings);
router.put("/rating/update/:id", Controller.updateRatings);

module.exports = router;
