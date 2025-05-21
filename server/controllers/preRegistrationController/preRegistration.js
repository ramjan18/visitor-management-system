const preRegistration = require("../../models/preRegistration");
const {transporter} = require("../../config/nodemailer");

const preRegister = async (req , res ) => {

    try {
        const {visitorName , email , phone  , date, time , personToMeet , purpose , status } = req.body;

    if(!visitorName || !email || !phone || !date || !time || !personToMeet || !purpose) {
        return res.status(404).json({
            message : "All fields are required"
        });
    }

    const visitorMailOptions = {
        from: `<${process.env.SMTP_MAIL}>`,
        to: email,
        subject: "You have preRegistered for meeting",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 40px; color: #333;">
            <table align="center" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="text-align: center; padding: 20px 0;">
                  <img src="https://example.com/logo.png" alt="Company Logo" width="120" style="display: block; margin: 0 auto;" />
                </td>
              </tr>
              <tr>
                <td>
                  <h2 style="color: #4CAF50; font-size: 24px; font-weight: bold;">Hello ${visitorName},</h2>
                  <p style="font-size: 16px; color: #555;">
                    Thank you for registering your visit. Below are your visit details:
                  </p>
                  <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
                    <tr>
                      <td style="padding: 8px 0;"><strong>Name:</strong></td><td>${visitorName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Email:</strong></td><td>${email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Phone Number:</strong></td><td>${phone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Visitor Type:</strong></td><td>${typeOfVisitor}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Person to Meet:</strong></td><td>${host.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Check-In Time:</strong></td>
                        <td>${checkInTime || new Date().toLocaleString()}</td>

                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Check-Out Time:</strong></td><td>${checkOutTime}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Purpose of Visit:</strong></td><td>${purpose}</td>
                    </tr>
                  </table>
      
                  <p style="font-size: 16px; color: #555; margin-top: 20px;">
                    Please carry a valid ID proof on your visit. We look forward to seeing you!
                  </p>
      
       
                  <p style="font-size: 14px; color: #777; margin-top: 30px;">
                    If you have any questions, feel free to contact us at 
                    <a href="mailto:meltx@yopmail.com" style="color: #1a73e8;">Meltx@yopmail.com</a>.
                  </p>
      
                  
                </td>
              </tr>
            </table>
          </div>
        `,
    }

    const newReq = await preRegistration.create({
        visitorName,
        email,
        phone,
        date,
        time,
        personToMeet,
        purpose,
        status
    })


    return res.status(201).json({
        message : "Registered successfully",
        newReq
    })
    } catch (error) {
       return res.status(500).json({
        message : "Failed to register"
       }) 
    }
    

}

module.exports = {preRegister}