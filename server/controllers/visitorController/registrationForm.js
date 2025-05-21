const { transporter } = require("../../config/nodemailer");
const Visitor = require("../../models/visitor");
const User = require("../../models/user")

const registrationForm = async (req , res) =>{

    try {
        // console.log(req.body);
        

        const { name , email , phoneNo  , personToMeet , checkInTime , checkOutTime , purpose , typeOfVisitor } = req.body;

        if (!name || !email || !phoneNo ){
            return res.status(400).json({
                message : "All fields are required "
            })
        }
    
        const host = await User.findById(personToMeet);

        const photoUrl = req.file?.path;
        // console.log("PhotoUrl : " , photoUrl );
        const chekedIn = checkInTime === '' ? Date.now() : checkInTime ;

        const newRegistration = await Visitor.create({
          name,
          email,
          photo : photoUrl,
          typeOfVisitor,
          phoneNo,
          personToMeet,
          checkInTime : chekedIn ,
          checkOutTime,
          purpose
      })
        

      const hasCheckedOut = checkOutTime === '' ? false : true ;

      const visitorId = newRegistration._id;
        const checkoutUrl = `http://localhost:5000/api/checkOutVisitor/${visitorId}`;

const visitorMailOptions = {
  from: `<${process.env.SMTP_MAIL}>`,
  to: email,
  subject: "Visitor Registration Confirmation",
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
            <h2 style="color: #4CAF50; font-size: 24px; font-weight: bold;">Hello ${name},</h2>
            <p style="font-size: 16px; color: #555;">
              Thank you for registering your visit. Below are your visit details:
            </p>
            <table cellpadding="0" cellspacing="0" width="100%" style="margin-top: 20px;">
              <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Phone Number:</strong></td><td>${phoneNo}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Visitor Type:</strong></td><td>${typeOfVisitor}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Person to Meet:</strong></td><td>${host.name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Check-In Time:</strong></td><td>${checkInTime || new Date().toLocaleString()}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Check-Out Time:</strong></td><td>${checkOutTime || 'Pending'}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Purpose of Visit:</strong></td><td>${purpose}</td></tr>
            </table>

            <p style="font-size: 16px; color: #555; margin-top: 20px;">
              Please carry a valid ID proof on your visit. We look forward to seeing you!
            </p>

            <li><strong>Photo:</strong><br/><img src="${photoUrl}" alt="Visitor Photo" style="width:150px; height:auto; border-radius:8px; margin-top:8px;" /></li>
            
           <p style="text-align:center; margin-top: 30px;">
  <a href="${checkoutUrl}" 
     ${hasCheckedOut ? 'style="background-color: gray; pointer-events: none; opacity: 0.6; cursor: not-allowed;"' : `
       style="
         background-color: #4CAF50;
         color: white;
         padding: 12px 24px;
         text-decoration: none;
         border-radius: 6px;
         font-weight: bold;
         display: inline-block;
       "`}
  >
    ${hasCheckedOut ? 'Already Checked Out' : 'Check Out'}
  </a>
</p>


            <p style="font-size: 14px; color: #777; margin-top: 30px;">
              If you have any questions, feel free to contact us at 
              <a href="mailto:meltx@yopmail.com" style="color: #1a73e8;">meltx@yopmail.com</a>.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `,
};

      
          const adminEmail = process.env.ADMIN_EMAIL || "admin123@yopmail.com";

    const adminMailOptions = {
      from: `<${process.env.SMTP_MAIL}>`,
      to: adminEmail,
      subject: "New Visitor Registered",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>New Visitor Registration</h2>
          <p>A new visitor has registered with the following details:</p>
          <ul>
           <li><strong>Photo:</strong><br/><img src="${photoUrl}" alt="Visitor Photo" style="width:150px; height:auto; border-radius:8px; margin-top:8px;" /></li>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone Number:</strong> ${phoneNo}</li>
            <li><strong>Visitor Type:</strong> ${typeOfVisitor}</li>
            <li><strong>Person to Meet:</strong> ${host.name}</li>
            <li><strong>Check-In Time:</strong> ${checkInTime || new Date().toLocaleString()}</li>
            <li><strong>Check-Out Time:</strong> ${checkOutTime || "N/A"}</li>
            <li><strong>Purpose:</strong> ${purpose}</li>
          </ul>
          <p>Please ensure the visitor is welcomed and assisted accordingly.</p>
        </div>
      `,
    };

    // Host Email
  

    // Send all emails in parallel
    await Promise.all([
      transporter.sendMail(visitorMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

       
    
        return res.status(200).json({
            message : "Registered successfully",
            newRegistration
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Failed to register"
        })
        
    }
   
}

module.exports= {registrationForm}