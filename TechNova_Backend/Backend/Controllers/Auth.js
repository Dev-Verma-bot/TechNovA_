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
  `${purpose}:${String(email || "").toLowerCase()}`;

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

/* =====================================================
   SEND SIGNUP OTP
===================================================== */

exports.sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({
        message: "Email is required",
      });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({
        message: "User already exists",
      });

    const otp = setOtp(email, "signup");

    await sendOtpEmail(email, otp, "signup");

    res.status(200).json({
      message: "Signup OTP sent",
    });
  } catch {
    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

/* =====================================================
   REGISTER (OTP VERIFIED)
===================================================== */

exports.register = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp)
      return res.status(400).json({
        message: "All fields required",
      });

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({
        message: "User already exists",
      });

    const otpResult = verifyOtp(email, "signup", otp);

    if (!otpResult.ok)
      return res.status(400).json({
        message: otpResult.message,
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      await sendSuccessEmail(email, "signup");
    } catch (err) {
      console.log("Success mail failed");
    }

    res.status(201).json({
      message: "Registered successfully",
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
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

    const user = await User.findOne({ email });

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

    /* COOKIE AUTH */
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
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
  } catch {
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

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const otp = setOtp(email, "reset-password");

    await sendOtpEmail(email, otp, "password-reset");

    res.status(200).json({
      message: "Password reset OTP sent",
    });
  } catch {
    res.status(500).json({
      message: "Failed to send reset OTP",
    });
  }
};

/* =====================================================
   RESET PASSWORD
===================================================== */

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    const otpResult = verifyOtp(
      email,
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
      await sendSuccessEmail(email, "password-reset");
    } catch { }

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch {
    res.status(500).json({
      message: "Password reset failed",
    });
  }
};