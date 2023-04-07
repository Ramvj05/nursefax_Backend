const express = require("express");
const router = express.Router();

const list = require("./list");
const getById = require("./getById");
const deleteUser = require("./delete");
const active = require("./active");
const inactive = require("./inactive");
const filter = require("./filter");
const verify = require("./verify");
const getMyProfile = require("./getUser");
const update = require("./updateUserProfile");
const getStatus = require("./getStatus");
const getUserProfiel = require("./getUserProfile");
const updateRegistrationProfile = require("./updateProfile");

router.use("/user", list);
router.use("/user", getById);
router.use("/user", deleteUser);
router.use("/user", active);
router.use("/user", inactive);
router.use("/user", getMyProfile);
router.use("/user", filter);
router.use("/user", verify);
router.use("/user", update);
router.use("/user", updateRegistrationProfile);
router.use("/user", getStatus);
router.use("/user", getUserProfiel);

module.exports = router;
