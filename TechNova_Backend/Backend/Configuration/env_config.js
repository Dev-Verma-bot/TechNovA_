const path = require("path");
const dotenv = require("dotenv");

// Prefer the outer project .env: TechNova_Backend/.env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// Fallback to Backend/.env if outer file is missing
dotenv.config();

const clean = (value, fallback = undefined) => {
  if (value === undefined || value === null) return fallback;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : fallback;
};

module.exports = {
  PORT: Number(clean(process.env.PORT, "5000")),
  MONGO_URI: clean(process.env.MONGO_URI),
  JWT_SECRET: clean(process.env.JWT_SECRET),
  JWT_EXPIRES_IN: clean(process.env.JWT_EXPIRES_IN, "7d"),
  CLIENT_URL: clean(process.env.CLIENT_URL, "http://localhost:5173"),
  MAIL_HOST: clean(process.env.MAIL_HOST),
  MAIL_USER: clean(process.env.MAIL_USER),
  MAIL_PASS: clean(process.env.MAIL_PASS),
};
