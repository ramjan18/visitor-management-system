const { transporter } = require("../../config/nodemailer");
const Visitor = require("../../models/visitor");

const setMeetingTime = async(req , res) => {
    try {
        const {meetingTime , id} = req.body;

        if(!meetingTime || !id) {
            return res.status(404).json({
                message : "all fields are required"
            })
        }

        const visitor = await Visitor.findById(id).populate("personToMeet" ,"name");

        const updatedVisitor= await Visitor.findByIdAndUpdate(id , {
            meetingTime
        })

        const visitorMailOptions = {
            from: `<${process.env.SMTP_MAIL}>`,
            to: visitor.email,
            subject: "Your Meeting is Scheduled",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
                <h2 style="color: #007bff;">Meeting Confirmation</h2>
                <p>Dear ${visitor.name},</p>
                <p>Your meeting has been successfully scheduled. Please find the details below:</p>
                <ul>
                  
                  <li><strong>Purpose:</strong> ${visitor.purpose}</li>
                  <li><strong>Person to Meet:</strong> ${visitor.personToMeet.name}</li>
                  <li><strong>Scheduled Time:</strong> ${new Date(meetingTime).toLocaleString()}</li>
                </ul>
                <p>Please arrive at least 10 minutes early. Carry a valid ID proof for verification.</p>
                <p>Thank you,<br/>MeltX Team</p>
              </div>
            `,
          };
          

          await transporter.sendMail(visitorMailOptions)

        return res.status(200).json({
            message : "Visitor updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message : "Failed to update "
        })
    }
}

module.exports = {setMeetingTime}