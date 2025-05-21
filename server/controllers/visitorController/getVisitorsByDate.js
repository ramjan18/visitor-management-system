const Visitor = require("../../models/visitor");

const getVisitorByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req?.query;
    let query = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // include entire end date

      query.checkInTime = {
        $gte: start,
        $lt: end
      };
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(startDate);
      end.setDate(end.getDate() + 1);

      query.checkInTime = {
        $gte: start,
        $lt: end
      };
    }

    const allVisitors = await Visitor.find(query).populate("personToMeet").sort({ checkInTime: -1 });

    if (!allVisitors || allVisitors.length === 0) {
      return res.status(404).json({
        message: "No data found",
        allVisitors: [],
      });
    }

    return res.status(200).json({
      message: "Data fetched successfully",
      allVisitors,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch data",
      error: error.message
    });
  }
};

module.exports = { getVisitorByDate };
