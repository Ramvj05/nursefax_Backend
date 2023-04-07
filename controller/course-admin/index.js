const express = require("express");
const router = express.Router();

const question = require("./questions");
const subject = require("./subject");
const subclass = require("./sub-class");
const microclass = require("./micro-class");
const nanoclass = require("./nano-class");
const category = require("./category");
const subCategory = require("./sub-category");
const questionPool = require("./question pools");
const mocktest = require("./mock-test");
const examTheory = require("./exam_thoery");
const course = require("./course");
const training = require("./training");
const profile = require("./profile");
const listCourses = require("./listCourses");
const classification = require("./classification");

router.use("/course-admin", question);
router.use("/course-admin", subject);
router.use("/course-admin", subclass);
router.use("/course-admin", microclass);
router.use("/course-admin", nanoclass);
router.use("/course-admin", category);
router.use("/course-admin", subCategory);
router.use("/course-admin", questionPool);
router.use("/course-admin", mocktest);
router.use("/course-admin", examTheory);
router.use("/course-admin", course);
router.use("/course-admin", training);
router.use("/course-admin", profile);
router.use("/course-admin", listCourses);
router.use("/course-admin", classification);

module.exports = router;
