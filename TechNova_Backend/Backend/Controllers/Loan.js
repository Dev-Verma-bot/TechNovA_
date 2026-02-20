const LoanApplication = require("../Modals/LoanApplication");

/* Apply Loan */
exports.submitLoan = async (req, res) => {
  try {
    const loan = await LoanApplication.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Loan application failed" });
  }
};

exports.getUserLoans = async (req, res) => {
  const loans = await LoanApplication.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(loans);
};

/* Get Loan Details */
exports.getLoanDetails = async (req, res) => {
  const loan = await LoanApplication.findById(req.params.id);
  if (!loan) {
    return res.status(404).json({ message: "Loan not found" });
  }
  res.json(loan);
};
