const FairnessReport = require("../Modals/FairnessReport");

exports.generateReport = async (req, res) => {
  const reports = await FairnessReport.find();
  res.json(reports);
};
