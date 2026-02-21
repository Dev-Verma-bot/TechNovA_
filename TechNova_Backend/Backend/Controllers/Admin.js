const LoanApplication = require("../Modals/LoanApplication");
const AdminActionLog = require("../Modals/AdminActionLog");
const FairnessReport = require("../Modals/FairnessReport");

/* Get all user loan requests */
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await LoanApplication.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const mapped = loans.map((loan) => ({
      _id: String(loan._id),
      name: loan?.userId?.name || "Applicant",
      email: loan?.userId?.email || "",
      amount: Number(loan.amount || 0),
      status: String(loan.status || "pending").toLowerCase(),
      predictedScore:
        loan.predictedScore !== null && loan.predictedScore !== undefined
          ? Number(loan.predictedScore)
          : null,
      probabilityApproval:
        loan.probabilityApproval !== null && loan.probabilityApproval !== undefined
          ? Number(loan.probabilityApproval)
          : null,
      riskCategory: loan.riskCategory || "",
      createdAt: loan.createdAt || null,
    }));

    res.json(mapped);
  } catch (error) {
    console.error("getAllLoans error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/* Approve / Reject user loan request */
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const normalizedStatus = String(status || "").toLowerCase();

    if (!["approved", "rejected", "pending"].includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status: normalizedStatus },
      { new: true }
    ).populate("userId", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    await AdminActionLog.create({
      adminId: req.user.id,
      loanId: req.params.id,
      action: normalizedStatus,
      note,
    });

    res.json({
      _id: String(updated._id),
      name: updated?.userId?.name || "Applicant",
      email: updated?.userId?.email || "",
      amount: Number(updated.amount || 0),
      status: String(updated.status || "pending").toLowerCase(),
      predictedScore:
        updated.predictedScore !== null && updated.predictedScore !== undefined
          ? Number(updated.predictedScore)
          : null,
      probabilityApproval:
        updated.probabilityApproval !== null && updated.probabilityApproval !== undefined
          ? Number(updated.probabilityApproval)
          : null,
      riskCategory: updated.riskCategory || "",
      createdAt: updated.createdAt || null,
    });
  } catch (error) {
    console.error("updateLoanStatus error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

exports.getFairnessStats = async (req, res) => {
  const stats = await FairnessReport.find().sort({ createdAt: -1 });
  res.json(stats);
};
