const express = require('express');
const router = express.Router();
const Controller = require("../../Controllers/WishlistController");;

router.get("/", Controller.getWishlistData);
router.get("/:id", Controller.getWishlistData);
router.post("/", Controller.saveWishlist);
router.put("/:id", Controller.updateWishlist);
router.put("/delete/:id", Controller.deleteWishlist);

module.exports = router;