const LoanApplication = require("../Modals/LoanApplication");
const AdminActionLog = require("../Modals/AdminActionLog");
const FairnessReport = require("../Modals/FairnessReport");

/* Get all loan requests */
exports.getAllLoans = async (req, res) => {
  const loans = await LoanApplication.find().populate("userId", "name email");
  res.json(loans);
};

/* Approve / Reject Loan */
exports.updateLoanStatus = async (req, res) => {
  const { status, note } = req.body;

  const loan = await LoanApplication.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  await AdminActionLog.create({
    adminId: req.user.id,
    loanId: loan._id,
    action: status,
    note,
  });

  res.json(loan);
};

exports.getFairnessStats = async (req, res) => {
  const stats = await FairnessReport.find().sort({ createdAt: -1 });
  res.json(stats);
};
