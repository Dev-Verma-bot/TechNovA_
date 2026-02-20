const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Configs
const connectDB = require("./Configuration/db_connect");
const corsOptions = require("./Configuration/cors_config");

// Middlewares
const errorHandler = require("./Middlewares/ErrorHandler");
const rateLimiter = require("./Middlewares/RateLimiter");

const app = express();

/* ---------------------------- DATABASE ---------------------------- */
connectDB();

/* --------------------------- GLOBAL MIDDLEWARES --------------------------- */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply global rate limit (optional but recommended)
app.use(rateLimiter);

/* ------------------------------ ROUTES ------------------------------ */
app.use("/api/v1/auth", require("./Routes/Auth_route"));
app.use("/api/v1/user", require("./Routes/User_route"));
app.use("/api/v1/loan", require("./Routes/Loan_route"));
app.use("/api/v1/admin", require("./Routes/Admin_route"));
app.use("/api/v1/risk", require("./Routes/Risk_route"));
app.use("/api/v1/fairness", require("./Routes/Fairness_route"));

/* --------------------------- HEALTH CHECK --------------------------- */
app.get("/", (req, res) => {
    res.send("TechNova Backend Running");
});

/* --------------------------- ERROR HANDLER --------------------------- */
app.use(errorHandler);

module.exports = app;
