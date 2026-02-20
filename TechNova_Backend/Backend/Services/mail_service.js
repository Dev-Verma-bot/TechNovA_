const nodemailer = require("nodemailer");
const { MAIL_HOST, MAIL_USER, MAIL_PASS } = require("../Configuration/env_config");

const MAIL_PORT = Number(process.env.MAIL_PORT || 465);
const MAIL_SECURE =
    process.env.MAIL_SECURE !== undefined
        ? String(process.env.MAIL_SECURE).toLowerCase() === "true"
        : MAIL_PORT === 465;

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

exports.sendOtpEmail = async (email, otp, purpose = "verification") => {
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
        throw new Error("Mail configuration is missing (MAIL_HOST, MAIL_USER, MAIL_PASS)");
    }

    const subject =
        purpose === "password-reset"
            ? "Your password reset OTP"
            : "Your signup OTP";

    const text =
        purpose === "password-reset"
            ? `Your password reset OTP is ${otp}. It expires in 10 minutes.`
            : `Your signup OTP is ${otp}. It expires in 10 minutes.`;

    await transporter.sendMail({
        from: MAIL_USER,
        to: email,
        subject,
        text,
    });
};

exports.sendSuccessEmail = async (email, purpose = "signup") => {
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
        throw new Error("Mail configuration is missing (MAIL_HOST, MAIL_USER, MAIL_PASS)");
    }

    const subject =
        purpose === "password-reset"
            ? "Password Reset Successful"
            : "Registration Successful";

    const text =
        purpose === "password-reset"
            ? "Your password has been reset successfully. If this was not you, contact support immediately."
            : "Your account was created successfully. Welcome to FairLoan AI.";

    await transporter.sendMail({
        from: MAIL_USER,
        to: email,
        subject,
        text,
    });
};