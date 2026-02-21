const User = require("../Modals/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRES_IN } =
  require("../Configuration/env_config");

const {
  sendOtpEmail,
  sendSuccessEmail,
} = require("../Services/mail_service");

/* =====================================================
   OTP SYSTEM
===================================================== */

const OTP_TTL_MS = 10 * 60 * 1000;
const otpStore = new Map();

const buildOtpKey = (email, purpose) =>
  `${purpose}:${String(email || "").toLowerCase().trim()}`;

const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

const setOtp = (email, purpose) => {
  const key = buildOtpKey(email, purpose);

  const otp = generateOtp();

  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });

  return otp;
};

const verifyOtp = (email, purpose, otp) => {
  const key = buildOtpKey(email, purpose);
  const record = otpStore.get(key);

  if (!record)
    return { ok: false, message: "OTP not requested" };

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return { ok: false, message: "OTP expired" };
  }

  if (String(record.otp) !== String(otp))
    return { ok: false, message: "Invalid OTP" };

  otpStore.delete(key);
  return { ok: true };
};

const isProd = String(process.env.NODE_ENV || "").toLowerCase() === "production";

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  const responseText = String(error.response || "").toLowerCase();
  const messageText = String(error.message || "").toLowerCase();
  if (responseText.includes("invalid login") || messageText.includes("invalid login")) {
    return "Mail authentication failed. Check MAIL_USER / MAIL_PASS app password.";
  }
  return error.message || fallback;
};

/* =====================================================
   SEND SIGNUP OTP
===================================================== */

exports.sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail)
      return res.status(400).json({
        message: "Email is required",
      });

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser)
      return res.status(400).json({
        message: "User already exists",
      });

    const otp = setOtp(normalizedEmail, "signup");

    try {
      await sendOtpEmail(normalizedEmail, otp, "signup");
      return res.status(200).json({
        message: "Signup OTP sent",
      });
    } catch (mailError) {
      console.error("sendSignupOtp mail error:", mailError);

      if (isProd) {
        return res.status(500).json({
          message: getErrorMessage(mailError, "Failed to send OTP"),
        });
      }

      return res.status(200).json({
        message: "OTP generated. Mail delivery failed in local mode.",
        devOtp: otp,
      });
    }
  } catch (error) {
    console.error("sendSignupOtp error:", error);
    res.status(500).json({
      message: getErrorMessage(error, "Failed to send OTP"),
    });
  }
};

/* =====================================================
   REGISTER (OTP VERIFIED)
===================================================== */

exports.register = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!name || !normalizedEmail || !password || !otp)
      return res.status(400).json({
        message: "All fields required",
      });

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser)
      return res.status(400).json({
        message: "User already exists",
      });

    const otpResult = verifyOtp(normalizedEmail, "signup", otp);

    if (!otpResult.ok)
      return res.status(400).json({
        message: otpResult.message,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    try {
      await sendSuccessEmail(normalizedEmail, "signup");
    } catch (err) {
      console.error("Signup success mail failed:", err.message || err);
    }

    res.status(201).json({
      message: "Registered successfully",
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("register error:", error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

/* =====================================================
   LOGIN
===================================================== */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
      });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({
      message: "Login failed",
    });
  }
};

/* =====================================================
   FORGOT PASSWORD OTP
===================================================== */

exports.sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const otp = setOtp(normalizedEmail, "reset-password");

    try {
      await sendOtpEmail(normalizedEmail, otp, "password-reset");
      return res.status(200).json({
        message: "Password reset OTP sent",
      });
    } catch (mailError) {
      console.error("sendForgotPasswordOtp mail error:", mailError);

      if (isProd) {
        return res.status(500).json({
          message: getErrorMessage(mailError, "Failed to send reset OTP"),
        });
      }

      return res.status(200).json({
        message: "Reset OTP generated. Mail delivery failed in local mode.",
        devOtp: otp,
      });
    }
  } catch (error) {
    console.error("sendForgotPasswordOtp error:", error);
    res.status(500).json({
      message: getErrorMessage(error, "Failed to send reset OTP"),
    });
  }
};

/* =====================================================
   RESET PASSWORD
===================================================== */

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const otpResult = verifyOtp(
      normalizedEmail,
      "reset-password",
      otp
    );

    if (!otpResult.ok)
      return res.status(400).json({
        message: otpResult.message,
      });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    try {
      await sendSuccessEmail(normalizedEmail, "password-reset");
    } catch (error) {
      console.error("Reset success mail failed:", error.message || error);
    }

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({
      message: "Password reset failed",
    });
  }
};
