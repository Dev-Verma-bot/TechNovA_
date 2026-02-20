const express = require("express");
const router = express.Router();

const loanController = require("../Controllers/Loan");
const auth = require("../Middlewares/Auth");

// User protected routes
router.post("/apply", auth, loanController.submitLoan);
router.get("/my-applications", auth, loanController.getUserLoans);
router.get("/details/:id", auth, loanController.getLoanDetails);

module.exports = router;