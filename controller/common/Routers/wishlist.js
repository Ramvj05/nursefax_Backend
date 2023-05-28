const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/WishlistController");

router.post("/courses/", Controller.getCourseWishlistData);
router.post("/blogs/", Controller.getBlogWishlistData);
router.post("/events/", Controller.getEventWishlistData);
router.post("/exams/", Controller.getExamWishlistData);
router.post("/jobs/", Controller.getJobWishlistData);
router.post("/", Controller.saveCourseWishlist);
router.put("/delete/:id", Controller.deleteCourseWishlist);

module.exports = router;
