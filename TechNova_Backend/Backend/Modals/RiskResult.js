const mongoose = require("mongoose");

const riskResultSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanApplication",
    },

    probability: Number,
    riskLevel: String,

    featureImportance: {
      type: Object, // SHAP values
    },

    recommendation: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskResult", riskResultSchema);