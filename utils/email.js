// app/utils/email.js

const nodemailer = require("nodemailer");

// Function to send emails
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use Gmail service
    auth: {
      user: process.env.GMAIL_USER, // Use the environment variable for Gmail username
      pass: process.env.GMAIL_PASS, // Use the environment variable for Gmail password
    },
  });

  const mailOptions = {
    from: "your-app@example.com",
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendEmail,
};
