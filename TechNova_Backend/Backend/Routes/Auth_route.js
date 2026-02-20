const express = require("express");
const router = express.Router();

const {
    login,
    register,
    sendSignupOtp,
    sendForgotPasswordOtp,
    resetPassword,
} = require("../Controllers/Auth");

router.post("/login", login);
router.post("/signup/send-otp", sendSignupOtp);
router.post("/signup", register);
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/reset-password", resetPassword);

module.exports = router;