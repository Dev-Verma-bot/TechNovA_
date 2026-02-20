const mongoose = require("mongoose");

const adminActionLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanApplication",
    },

    action: {
      type: String,
      enum: ["approved", "rejected"],
    },

    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminActionLog", adminActionLogSchema);