const User = require("../Modals/User");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name } = req.body;
  const updates = {};

  if (typeof name === "string" && name.trim()) {
    updates.name = name.trim();
  }

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
  }).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};
