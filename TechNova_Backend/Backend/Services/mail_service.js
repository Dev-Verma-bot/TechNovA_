const nodemailer = require("nodemailer");
const {
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASS,
} = require("../Configuration/env_config");

const getMailPort = () => {
  const raw = String(process.env.MAIL_PORT || "465").trim();
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 465;
};

const getMailSecure = (port) => {
  if (process.env.MAIL_SECURE !== undefined) {
    return String(process.env.MAIL_SECURE).trim().toLowerCase() === "true";
  }
  return port === 465;
};

const getTransporter = () => {
  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    throw new Error("Mail configuration is missing (MAIL_HOST, MAIL_USER, MAIL_PASS)");
  }

  const port = getMailPort();
  const secure = getMailSecure(port);

  return nodemailer.createTransport({
    host: MAIL_HOST,
    port,
    secure,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });
};

exports.sendOtpEmail = async (email, otp, purpose = "verification") => {
  const transporter = getTransporter();

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
  const transporter = getTransporter();

  const subject =
    purpose === "password-reset"
      ? "Password Reset Successful"
      : "Registration Successful";

  const text =
    purpose === "password-reset"
      ? "Your password has been reset successfully. If this was not you, contact support immediately."
      : "Your account was created successfully. Welcome to CredNova.";

  await transporter.sendMail({
    from: MAIL_USER,
    to: email,
    subject,
    text,
  });
};

