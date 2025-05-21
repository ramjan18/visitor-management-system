const Bookings = require("../../models/transporterBooking");
const ExcelJS = require("exceljs");

const exportBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find({})
    .populate("personToMeet")
      

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Visitors");

    // Define columns with headers and widths
    worksheet.columns = [
      { header: "name", key: "name", width: 25 },
      { header: "email", key: "", width: 25 },
      { header: "", key: "", width: 30 },
      { header: "", key: "", width: 30 },
      { header: "", key: "", width: 20 },
      { header: "", key: "", width: 20 },
    ];

    // Add rows
    // Add rows
    bookings.forEach((b) => {
      const row = worksheet.addRow({
        transporter: b.transporter?.name || "N/A",
        farmer: b.farmer?.name || "N/A",
        pickup: b.pickupLocation,
        drop: b.dropLocation,
        status: b.bookingStatus,
        date: b.createdAt.toISOString().split("T")[0],
      });

      const statusCell = row.getCell("status");

      // Apply fill color based on status
      let fillColor;
      switch (b.bookingStatus.toLowerCase()) {
        case "completed":
          fillColor = "FF92D050"; // Light green
          break;
        case "cancelled":
          fillColor = "FFFF0000"; // Red
          break;
        case "pending":
          fillColor = "FFFFFF00"; // Yellow
          break;
        default:
          fillColor = null;
      }

      if (fillColor) {
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
        statusCell.font = { bold: true };
      }
    });

    // Add header styling
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCE5FF" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Send Excel file as a stream
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="bookings.xlsx"'
    );

    await workbook.xlsx.write(res); // Stream to response
    res.end(); // End the response
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).send("Error exporting bookings");
  }
};

module.exports = { exportBookings };
