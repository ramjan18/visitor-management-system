

const Visitor = require("../../models/visitor");

const deleteVisitors = async (req, res) => {
  try {
    const { ids } = req.params; 

    if (!ids || (Array.isArray(ids) && ids.length === 0)) {
      return res.status(400).json({ message: "No visitor ID(s) provided." });
    }

    
    if (typeof ids === "string") {
      await Visitor.findByIdAndDelete(ids);
      return res.status(200).json({ message: "Visitor deleted successfully." });
    }

   
    if (Array.isArray(ids)) {
      await Visitor.deleteMany({ _id: { $in: ids } });
      return res.status(200).json({ message: "Visitors deleted successfully." });
    }

    return res.status(400).json({ message: "Invalid format for visitor ID(s)." });
  } catch (error) {
    console.error("Error deleting visitors:", error);
    res.status(500).json({ message: "Server error while deleting visitors." });
  }
};

module.exports = { deleteVisitors };
