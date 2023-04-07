const express = require("express");
const router = express.Router();

const courseAdminCreate = require("../../controller/sp-admin/course-admin/create");
const courseAdminList = require("../../controller/sp-admin/course-admin/list");
const getCourseAdmin = require("../../controller/sp-admin/course-admin/getById");
const deleteCourseAdmin = require("../../controller/sp-admin/course-admin/delete");
const updateCourseAdmin = require("../../controller/sp-admin/course-admin/update");
const activeCourseAdmin = require("../../controller/sp-admin/course-admin/active");
const filter = require("../../controller/sp-admin/course-admin/filter");
const exam = require("./exam");
const course = require("./course");
const training = require("./training");
const category = require("./category");
const user = require("./user/updateuser");

router.use("/admin", courseAdminCreate);
router.use("/admin", courseAdminList);
router.use("/admin", getCourseAdmin);
router.use("/admin", deleteCourseAdmin);
router.use("/admin", activeCourseAdmin);
router.use("/admin", updateCourseAdmin);
router.use("/admin", filter);
router.use("/admin", exam);
router.use("/admin", course);
router.use("/admin", training);
router.use("/admin", category);
router.use("/admin", user);

module.exports = router;
