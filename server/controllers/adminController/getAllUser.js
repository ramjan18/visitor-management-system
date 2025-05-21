const User = require("../../models/user");

const getAllUsers = async (req, res) => {
  try {
    const visitors = await User.find().sort({ createdAt: -1 }); // latest first
    return res.status(200).json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return res.status(500).json({ message: "Failed to fetch visitors" });
  }
};

module.exports = { getAllUsers };
