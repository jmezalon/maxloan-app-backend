const { google } = require("googleapis");
const nodemailer = require("nodemailer");

// Create an OAuth2 client with your client ID and client secret
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

// Function to send an email using OAuth2 authentication
const sendEmailWithOAuth2 = async (user, subject, text) => {
  try {
    // Get OAuth2 tokens for sending emails
    const tokens = await oAuth2Client.getAccessToken();

    // Create a Nodemailer transporter using OAuth2 credentials
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: tokens.res.data.refresh_token,
        accessToken: tokens.token,
      },
    });

    const mailOptions = {
      from: "noreply@ezmaxloan.com",
      to: user.email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
};

module.exports = {
  sendEmailWithOAuth2,
};
