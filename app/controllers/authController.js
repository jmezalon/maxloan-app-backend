const { google } = require("googleapis");
const crypto = require("crypto");
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
      from: "your-app@example.com",
      to: user.email,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("OAuth2 token error:", error);
  }
};

// Function to generate and send email verification token
const generateEmailVerificationToken = async (user) => {
  const token = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
  await user.save();

  // Send an email with the confirmation link containing the token
  const confirmationLink = `https://your-app.com/verify-email?token=${token}`;
  const emailText = `Click the following link to verify your email address: ${confirmationLink}`;

  await sendEmailWithOAuth2(user, "Email Verification", emailText);
};

// Handle email confirmation route
app.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: { $gte: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  if (user.emailVerificationExpiry < Date.now()) {
    // Token has expired, handle the expiration
    const newToken = crypto.randomBytes(20).toString("hex");
    user.emailVerificationToken = newToken;
    user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // Set a new expiration time (e.g., 24 hours)
    await user.save();

    // Send a new email with the updated verification link
    const newConfirmationLink = `https://your-app.com/verify-email?token=${newToken}`;
    const emailText = `Your previous email verification link has expired. Click the following link to verify your email address: ${newConfirmationLink}`;

    await sendEmailWithOAuth2(user, "Email Verification", emailText);

    return res.status(400).json({
      message:
        "Email verification link has expired. We have sent a new link to your email address.",
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return res.status(200).json({ message: "Email verified successfully" });
});
