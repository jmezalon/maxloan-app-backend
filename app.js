require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

const { google } = require("googleapis");
const nodemailer = require("nodemailer");

// Create an OAuth2 client with your client ID and client secret
const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

// Generate an OAuth2 URL for user consent
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/gmail.send"],
});

// Redirect the user to the auth URL for consent
app.get("/auth", (req, res) => {
  res.redirect(authUrl);
});

// Handle the OAuth2 callback after user consent
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Get tokens using the authorization code
    const { tokens } = await oAuth2Client.getToken(code);

    // Set the credentials for further requests
    oAuth2Client.setCredentials(tokens);

    // Create a Nodemailer transporter using OAuth2 credentials
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "your-email@gmail.com",
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
      },
    });

    // Send an email
    const mailOptions = {
      from: "your-email@gmail.com",
      to: "recipient@example.com",
      subject: "Test Email",
      text: "This is a test email sent using Gmail and OAuth 2.0 authentication.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email");
      } else {
        console.log("Email sent:", info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  } catch (error) {
    console.error("OAuth2 callback error:", error);
    res.status(500).send("OAuth2 callback error");
  }
});

mongoose.connect("mongodb://localhost/maxloan-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
