const express = require("express");
const router = express.Router();

const login = require("./login");
const signup = require("./signup");
const forgotPassword = require("./forgot-password");
const bypass = require("./bypass");
const linkedin = require("./linkedin");
const otp = require("./otp");
const validateUsername = require("./validateUsername");
const validateUserId = require("./validateUserId");

router.use("/auth", otp);
router.use("/auth", login);
router.use("/auth", signup);
router.use("/auth", forgotPassword);
router.use("/auth", bypass);
router.use("/auth", linkedin);
router.use("/auth", validateUsername);
router.use("/auth", validateUserId);

module.exports = router;
