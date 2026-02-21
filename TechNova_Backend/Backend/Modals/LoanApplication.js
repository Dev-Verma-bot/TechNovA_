const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    tenureMonths: {
      type: Number,
      required: true,
    },
    monthlyIncome: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Persist ML decision snapshot so dashboard stays stable across reload/login.
    predictedScore: {
      type: Number,
      default: null,
    },
    decisionStatus: {
      type: String,
      enum: ["approved", "manual", "declined"],
      default: null,
    },
    decisionCategory: {
      type: String,
      enum: ["green", "yellow", "red"],
      default: null,
    },
    probabilityApproval: {
      type: Number,
      default: null,
    },
    probabilityDefault: {
      type: Number,
      default: null,
    },
    riskCategory: {
      type: String,
      default: "",
    },
    decisionMessage: {
      type: String,
      default: "",
    },

    notes: String,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.LoanApplication ||
  mongoose.model("LoanApplication", loanApplicationSchema);
