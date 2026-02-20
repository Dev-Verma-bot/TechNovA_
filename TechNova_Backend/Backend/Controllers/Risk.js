const RiskResult = require("../Modals/RiskResult");
const LoanApplication = require("../Modals/LoanApplication");

/* Risk Analysis */
exports.getRiskAnalysis = async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const probability = Math.random(); // placeholder
    const riskLevel = probability > 0.5 ? "HIGH" : "LOW";

    const result = await RiskResult.create({
      loanId: loan._id,
      probability,
      riskLevel,
      featureImportance: {},
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Risk prediction failed" });
  }
};
