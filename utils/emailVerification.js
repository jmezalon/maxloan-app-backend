const crypto = require("crypto");

// Function to send an email with an email verification token
const sendEmailVerificationToken = async (user) => {
  const token = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
  await user.save();

  // Send an email with the verification link containing the token
  const confirmationLink = `https://your-app.com/verify-email?token=${token}`;
  const emailText = `Click the following link to verify your email address: ${confirmationLink}`;

  return { token, emailText };
};

// Function to check and handle email verification token expiration
const handleTokenExpiration = async (user, sendEmailFn) => {
  if (!user.emailVerificationExpiry) {
    return null; // No email verification token set
  }

  if (user.emailVerificationExpiry < Date.now()) {
    // Token has expired, handle the expiration
    const { token, emailText } = await sendEmailVerificationToken(user);

    try {
      await sendEmailFn(user.email, "Email Verification", emailText);
      return { expired: true, newToken: token };
    } catch (error) {
      console.error("Error sending email:", error);
      return { expired: true, error: "Failed to send email" };
    }
  }

  return null; // Token is still valid
};

module.exports = {
  sendEmailVerificationToken,
  handleTokenExpiration,
};
