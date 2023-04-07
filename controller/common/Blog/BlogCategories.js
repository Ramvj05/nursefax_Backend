const express = require('express');
const router = express.Router();
const Controller = require("../../BlogController/BlogCategoriesController");;

router.get("/", Controller.getBlogCategoriesData);
router.get("/:id", Controller.getBlogCategoriesData);
router.post("/", Controller.saveBlogCategories);
router.put("/:id", Controller.updateBlogCategories);
router.put("/delete/:id", Controller.deleteBlogCategories);

module.exports = router;