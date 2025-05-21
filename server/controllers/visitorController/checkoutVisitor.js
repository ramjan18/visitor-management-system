const { transporter } = require("../../config/nodemailer");
const Visitor = require("../../models/visitor");
const User = require("../../models/user");

const checkoutVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const checkOutTime = new Date();

    const isCheckedOut = await Visitor.findById(id);

    if(isCheckedOut.checkOutTime ){
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Already Checked Out</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(to right, #fff3e0, #ffe0b2);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }
              .container {
                background: #fff8e1;
                padding: 40px 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                text-align: center;
                animation: fadeIn 0.6s ease-in-out;
              }
              h1 {
                color: #ef6c00;
                margin-bottom: 16px;
              }
              p {
                font-size: 16px;
                color: #555;
                margin-bottom: 24px;
              }
              .warning {
                font-size: 48px;
                color: #fb8c00;
              }
              a {
                text-decoration: none;
                color: #fff;
                background-color: #ef6c00;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: bold;
                transition: background-color 0.3s ease;
              }
              a:hover {
                background-color: #e65100;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="warning">⚠️</div>
              <h1>Already Checked Out</h1>
              <p>You have already completed the check-out process. No further action is needed.</p>
              <a href="http://localhost:5173/visitorForm">Return to Home</a>
            </div>
          </body>
        </html>
      `);
      
    }

    // Update visitor's check-out time
    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { checkOutTime },
      { new: true }
    ).populate("personToMeet");

    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    // Send checkout email to visitor
    const mailOptions = {
      from: `<${process.env.SMTP_MAIL}>`,
      to: visitor.email,
      subject: "Checkout Confirmation - Visitor Management System",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 30px; color: #333;">
          <table width="600" align="center" style="background-color: #fff; padding: 20px; border-radius: 10px;">
            <tr><td style="text-align:center;"><h2 style="color:#4CAF50;">Thank you for your visit, ${visitor.name}!</h2></td></tr>
            <tr><td>
              <p>You have successfully checked out. Here are the details of your visit:</p>
              <ul>
                <li><strong>Name:</strong> ${visitor.name}</li>
                <li><strong>Email:</strong> ${visitor.email}</li>
                <li><strong>Phone:</strong> ${visitor.phoneNo}</li>
                <li><strong>Visitor Type:</strong> ${visitor.typeOfVisitor}</li>
                <li><strong>Person Met:</strong> ${visitor.personToMeet?.name}</li>
                <li><strong>Check-In Time:</strong> ${visitor.checkInTime}</li>
                <li><strong>Check-Out Time:</strong> ${visitor.checkOutTime}</li>
                <li><strong>Purpose:</strong> ${visitor.purpose}</li>
              </ul>
              <p>We hope your visit was pleasant.</p>
            </td></tr>
           
          </table>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Check-Out Successful</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(to right, #e0f2f1, #e8f5e9);
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .container {
              background: #fff;
              padding: 40px 30px;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              text-align: center;
              animation: fadeIn 0.6s ease-in-out;
            }
            h1 {
              color: #2e7d32;
              margin-bottom: 16px;
            }
            p {
              font-size: 16px;
              color: #555;
              margin-bottom: 24px;
            }
            .checkmark {
              font-size: 48px;
              color: #4CAF50;
            }
            a {
              text-decoration: none;
              color: #fff;
              background-color: #4CAF50;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: bold;
              transition: background-color 0.3s ease;
            }
            a:hover {
              background-color: #43a047;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="checkmark">✅</div>
            <h1>Check-Out Successful</h1>
            <p>You have successfully checked out. Thank you for visiting!</p>
            <a href="http://localhost:5173/visitorForm">Return to Home</a>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Checkout failed" });
  }
};

module.exports = { checkoutVisitor };
