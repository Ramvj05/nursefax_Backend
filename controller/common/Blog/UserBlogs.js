const express = require('express');
const router = express.Router();
const Controller = require("../../BlogController/UserBlogController");;

router.get("/", Controller.getUserBlogsData);
router.get("/:id", Controller.getUserBlogsData);
router.post("/", Controller.saveUserBlogs);
router.put("/:id", Controller.updateUserBlogs);
router.put("/delete/:id", Controller.deleteUserBlogs);

module.exports = router;