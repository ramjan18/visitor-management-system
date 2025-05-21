const { transporter } = require("../../config/nodemailer");
const User = require("../../models/user");
const Visitor = require("../../models/visitor");

const updateStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found." });
    }

    const host = await User.findById(visitor.personToMeet);
    if (!host) {
      return res.status(404).json({ message: "Host not found." });
    }

    const updatedStatus = await Visitor.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (status === "Approved") {
      const hostMailOptions = {
        from: `<${process.env.SMTP_MAIL}>`,
        to: host.email,
        subject: `Visitor ${visitor.name} is here to meet you`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Hello ${host.name},</h2>
            <p>You have a visitor waiting to meet you. Here are the details:</p>
            <ul>
              <li><strong>Name:</strong> ${visitor.name}</li>
              <li><strong>Email:</strong> ${visitor.email}</li>
              <li><strong>Phone Number:</strong> ${visitor.phoneNo}</li>
              <li><strong>Visitor Type:</strong> ${visitor.typeOfVisitor}</li>
              <li><strong>Check-In Time:</strong> ${visitor.checkInTime || new Date().toLocaleString()}</li>
              <li><strong>Check-Out Time:</strong> ${visitor.checkOutTime || "N/A"}</li>
              <li><strong>Purpose:</strong> ${visitor.purpose}</li>
            </ul>
            <p>Please be prepared to receive your visitor.</p>
          </div>
        `,
      };

      await transporter.sendMail(hostMailOptions);
    } else {
      const visitorMailOptions = {
        from: `<${process.env.SMTP_MAIL}>`,
        to: visitor.email,
        subject: "Update on Your Visit Request",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 40px; color: #333;">
            <table align="center" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="text-align: center; padding: 20px 0;">
                  <img src="https://example.com/logo.png" alt="MeltX Logo" width="120" style="display: block; margin: 0 auto;" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2 style="color: #d9534f; font-size: 24px; font-weight: bold;">Dear ${visitor.name},</h2>
                  <p style="font-size: 16px; color: #555;">
                    Thank you for your interest in visiting MeltX. We appreciate your time and effort in submitting your request.
                  </p>
                  <p style="font-size: 16px; color: #555;">
                    Unfortunately, your meeting request has not been approved at this time. We hope to have an opportunity to connect with you in the future.
                  </p>
      
                  <h3 style="margin-top: 30px; color: #333;">Your Visit Details:</h3>
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px;">
                    <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${visitor.name}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${visitor.email}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Phone Number:</strong></td><td>${visitor.phoneNo}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Visitor Type:</strong></td><td>${visitor.typeOfVisitor}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Person to Meet:</strong></td><td>${host.name}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Check-In Time:</strong></td><td>${visitor.checkInTime || new Date().toLocaleString()}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Check-Out Time:</strong></td><td>${visitor.checkOutTime || 'Pending'}</td></tr>
                    <tr><td style="padding: 8px 0;"><strong>Purpose of Visit:</strong></td><td>${visitor.purpose}</td></tr>
                  </table>
      
                  ${visitor.photoUrl ? `
                    <li><strong>Photo:</strong><br/><img src="${visitor.photoUrl}" alt="Visitor Photo" style="width:150px; height:auto; border-radius:8px; margin-top:8px;" /></li>
                  ` : ""}
      
                  <p style="font-size: 16px; color: #555; margin-top: 20px;">
                    If you have any questions or would like to reschedule, please don’t hesitate to reach out.
                  </p>
      
                  <p style="font-size: 14px; color: #777; margin-top: 30px;">
                    You can contact us at 
                    <a href="mailto:meltx@yopmail.com" style="color: #1a73e8;">meltx@yopmail.com</a>.
                  </p>
      
                  <p style="font-size: 16px; color: #333; margin-top: 30px;">
                    We appreciate your understanding and thank you once again for considering MeltX.
                  </p>
      
                  <p style="font-size: 16px; font-weight: bold; color: #4CAF50; margin-top: 40px;">
                    Sincerely,<br/>
                    The MeltX Team
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `,
      };

      await transporter.sendMail(visitorMailOptions);
    }

    return res.status(200).json({
      message: "Status updated successfully",
      updatedStatus,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({
      message: "Failed to update",
      error: error.message,
    });
  }
};

module.exports = { updateStatus };
