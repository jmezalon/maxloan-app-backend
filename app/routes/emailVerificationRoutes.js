const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { handleTokenExpiration } = require("../../utils/emailVerification");
const { sendEmailWithOAuth2 } = require("../../utils/email");

// Handle email confirmation route
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpiry: { $gte: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const emailTokenResult = await handleTokenExpiration(
    user,
    sendEmailWithOAuth2
  );

  if (emailTokenResult && emailTokenResult.expired) {
    if (emailTokenResult.error) {
      return res.status(500).json({ message: "Failed to send email" });
    } else {
      return res.status(400).json({
        message:
          "Email verification link has expired. We have sent a new link to your email address.",
        newToken: emailTokenResult.newToken,
      });
    }
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  return res.status(200).json({ message: "Email verified successfully" });
});

module.exports = router;
