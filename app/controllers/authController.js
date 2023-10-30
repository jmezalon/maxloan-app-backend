const { sendEmail } = require("../../utils/email");

// After user registers, generate and send email verification token
const generateEmailVerificationToken = async (user) => {
  const token = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
  await user.save();

  // Send an email with the confirmation link containing the token
  const confirmationLink = `https://your-app.com/verify-email?token=${token}`;
  const emailText = `Click the following link to verify your email address: ${confirmationLink}`;

  // Use Nodemailer or a similar library to send the email
  // Example: Send email using Nodemailer
  const transporter = nodemailer.createTransport({
    // Configure your email transport (e.g., SMTP, Gmail)
  });

  const mailOptions = {
    from: "your-app@example.com",
    to: user.email,
    subject: "Email Verification",
    text: emailText,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
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

  // Check if the token is expired
  if (user.emailVerificationExpiry < Date.now()) {
    // Token has expired, handle the expiration
    const newToken = crypto.randomBytes(20).toString("hex");
    user.emailVerificationToken = newToken;
    user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // Set a new expiration time (e.g., 24 hours)
    await user.save();

    // Send a new email with the updated verification link
    const newConfirmationLink = `https://your-app.com/verify-email?token=${newToken}`;
    const emailText = `Your previous email verification link has expired. Click the following link to verify your email address: ${newConfirmationLink}`;

    // Send the email using your email sending utility
    sendEmail(user.email, "Email Verification", emailText)
      .then(() => {
        // Email sent successfully
        return res.status(400).json({
          message:
            "Email verification link has expired. We have sent a new link to your email address.",
        });
      })
      .catch((error) => {
        // Handle email sending error
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      });

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
