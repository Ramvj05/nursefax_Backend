const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/BlogCategoriesController");

router.get("/catedetails/", Controller.getBlogCategoriesAllData);
router.get("/", Controller.getBlogCategoriesData);
router.get("/:id", Controller.getBlogCategoriesData);
router.get("/catedetails/:id", Controller.getBlogCategoriesAllData);
router.post("/", Controller.saveBlogCategories);
router.put("/:id", Controller.updateBlogCategories);
router.put("/delete/:id", Controller.deleteBlogCategories);

module.exports = router;
