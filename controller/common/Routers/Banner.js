const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/BannerController");

router.get("/", Controller.getBanner);
router.get("/testimonial/", Controller.getTestimonial);
router.get("/:id", Controller.getBanner);
router.post("/", Controller.saveBanner);
router.put("/delete/:id", Controller.deleteBanner);
router.put("/update/:id", Controller.updateBanner);

module.exports = router;
