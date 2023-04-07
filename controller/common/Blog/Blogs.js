const express = require('express');
const router = express.Router();
const Controller = require("../../BlogController/BlogController");;

router.get("/", Controller.getBlogsData);
router.get("/:id", Controller.getBlogsData);
router.post("/", Controller.saveBlogs);
router.put("/:id", Controller.updateBlogs);
router.put("/delete/:id", Controller.deleteBlogs);

module.exports = router;