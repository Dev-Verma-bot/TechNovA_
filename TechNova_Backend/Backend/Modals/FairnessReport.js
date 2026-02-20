const mongoose = require("mongoose");

const fairnessReportSchema = new mongoose.Schema(
  {
    group: String, // e.g. income group, gender, etc

    approvalRate: Number,
    rejectionRate: Number,

    biasScore: Number,

    metrics: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FairnessReport", fairnessReportSchema);