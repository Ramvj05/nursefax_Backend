const express = require("express");
const router = express.Router();
const listExams = require("./listExams");
const getExam = require("./getExam");
const listCourses = require("./listCourses");
const listTrainings = require("./listTrainings");
const listFeaturedCourses = require("./listFeaturedCourses");
const getByCategoryId = require("./getByCategoryId");

router.use("/list", listExams);
router.use("/list", getExam);
router.use("/list", listCourses);
router.use("/list", listTrainings);
router.use("/list", listFeaturedCourses);
router.use("/list", getByCategoryId);

module.exports = router;
