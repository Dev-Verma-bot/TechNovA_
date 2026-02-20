const express = require("express");
const router = express.Router();

const adminController = require("../Controllers/Admin");
const auth = require("../Middlewares/Auth");
const authorizeRoles = require("../Middlewares/Role");

// Admin only
router.get("/all-loans", auth, authorizeRoles("admin"), adminController.getAllLoans);
router.get("/fairness-metrics", auth, authorizeRoles("admin"), adminController.getFairnessStats);

module.exports = router;