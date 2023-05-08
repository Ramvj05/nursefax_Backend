const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/BlogController");

router.get("/userblog/", Controller.getUserBlogsData);
router.get("/", Controller.getBlogsData);
router.get("/:id", Controller.getBlogsData);
router.get("/userblog/:id", Controller.getUserBlogsData);
router.post("/", Controller.saveBlogs);
router.post("/view/", Controller.saveViewBlogs);
router.put("/:id", Controller.updateBlogs);
router.put("/delete/:id", Controller.deleteBlogs);

module.exports = router;
