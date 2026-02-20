const express = require("express");
const router = express.Router();

const fairnessController = require("../Controllers/Fairness");
const auth = require("../Middlewares/Auth");
const authorizeRoles = require("../Middlewares/Role");

// Admin only insights
router.get("/report", auth, authorizeRoles("admin"), fairnessController.generateReport);

module.exports = router;