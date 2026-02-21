const LoanApplication = require("../Modals/LoanApplication");

const parseProbability = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string" && value.trim().endsWith("%")) {
    const num = Number(value.replace("%", "").trim());
    if (!Number.isFinite(num)) return null;
    return num / 100;
  }
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  if (num >= 0 && num <= 1) return num;
  if (num > 1 && num <= 100) return num / 100;
  return null;
};

const normalizeLoan = (loanDoc) => {
  const loan = loanDoc && typeof loanDoc.toObject === "function" ? loanDoc.toObject() : loanDoc;
  const probabilityApproval = parseProbability(loan?.probabilityApproval);
  const predictedScoreRaw =
    loan?.predictedScore !== null && loan?.predictedScore !== undefined && loan?.predictedScore !== ""
      ? Number(loan.predictedScore)
      : null;

  const predictedScore = Number.isFinite(predictedScoreRaw)
    ? predictedScoreRaw
    : probabilityApproval !== null
    ? Math.round(300 + probabilityApproval * 550)
    : null;

  const status =
    ["pending", "approved", "rejected"].includes(String(loan?.status || "").toLowerCase())
      ? String(loan.status).toLowerCase()
      : String(loan?.decisionStatus || "").toLowerCase() === "declined"
      ? "rejected"
      : "pending";

  return {
    ...loan,
    status,
    probabilityApproval,
    predictedScore,
  };
};

/* Apply Loan */
exports.submitLoan = async (req, res) => {
  try {
    const {
      amount,
      purpose,
      tenureMonths,
      monthlyIncome,
      status,
      predictedScore,
      decisionStatus,
      decisionCategory,
      probabilityApproval,
      probabilityDefault,
      riskCategory,
      decisionMessage,
      notes,
    } = req.body || {};

    if (
      !Number.isFinite(Number(amount)) ||
      !String(purpose || "").trim() ||
      !Number.isFinite(Number(tenureMonths)) ||
      !Number.isFinite(Number(monthlyIncome))
    ) {
      return res.status(400).json({
        message: "amount, purpose, tenureMonths and monthlyIncome are required",
      });
    }

    const loan = await LoanApplication.create({
      userId: req.user.id,
      amount: Number(amount),
      purpose: String(purpose).trim(),
      tenureMonths: Number(tenureMonths),
      monthlyIncome: Number(monthlyIncome),
      status: ["pending", "approved", "rejected"].includes(status) ? status : "pending",
      predictedScore: Number.isFinite(Number(predictedScore)) ? Number(predictedScore) : null,
      decisionStatus: ["approved", "manual", "declined"].includes(decisionStatus)
        ? decisionStatus
        : null,
      decisionCategory: ["green", "yellow", "red"].includes(decisionCategory)
        ? decisionCategory
        : null,
      probabilityApproval: Number.isFinite(Number(probabilityApproval))
        ? Number(probabilityApproval)
        : null,
      probabilityDefault: Number.isFinite(Number(probabilityDefault))
        ? Number(probabilityDefault)
        : null,
      riskCategory: String(riskCategory || ""),
      decisionMessage: String(decisionMessage || ""),
      notes,
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error("submitLoan error:", error);
    res.status(500).json({ message: "Loan application failed" });
  }
};

exports.getUserLoans = async (req, res) => {
  try {
    const loans = await LoanApplication.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(loans.map(normalizeLoan));
  } catch (error) {
    console.error("getUserLoans error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/* Get Loan Details */
exports.getLoanDetails = async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.json(loan);
  } catch (error) {
    console.error("getLoanDetails error:", error);
    res.status(500).json({ message: "Failed to fetch loan details" });
  }
};
