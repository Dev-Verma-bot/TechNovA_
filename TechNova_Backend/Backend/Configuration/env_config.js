const path = require("path");
const dotenv = require("dotenv");

// Prefer the outer project .env: TechNova_Backend/.env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// Fallback to Backend/.env if outer file is missing
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};
