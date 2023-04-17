const express = require('express');
const router = express.Router();
const Controller = require("../../BlogController/UserRatingController");;

router.get("/", Controller.getUserRatingsData);
router.get("/:id", Controller.getUserRatingsData);
router.post("/", Controller.saveUserRatings);
router.put("/:id", Controller.updateUserRatings);
router.put("/delete/:id", Controller.deleteUserRatings);

module.exports = router;