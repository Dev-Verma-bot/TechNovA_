const express = require("express");
const router = express.Router();

const riskController = require("../Controllers/Risk");
const auth = require("../Middlewares/Auth");
const authorizeRoles = require("../Middlewares/Role");

// Admin can view risk analysis
router.get("/analysis/:loanId", auth, authorizeRoles("admin"), riskController.getRiskAnalysis);

module.exports = router;