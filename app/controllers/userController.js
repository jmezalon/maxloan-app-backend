const User = require("../models/User");
const { sendEmailWithOAuth2 } = require("../../utils/email");
const {
  handleTokenExpiration,
  sendEmailVerificationToken,
} = require("../../utils/emailVerification");

const userController = {
  // Action to create a new user profile
  createUser: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        birthday,
        isEmployed,
        income,
      } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Hash the password securely before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // Use a salt round of 10

      // Create a new user object with the extracted and hashed data
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthday: new Date(birthday), // Convert to Date object
        isEmployed,
        income,
      });

      await newUser.save();

      // After successfully saving the user, send the email verification token
      const emailTokenResult = await sendEmailVerificationToken(newUser);

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

      // Respond with a success message
      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      // Handle errors
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user." });
    }
  },

  // Action to retrieve user profile by ID
  // Action to retrieve user profile by ID
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      // Implement logic to retrieve a user profile by ID
      // Example: Retrieve user based on req.params.userId
      const user = await User.findById(userId);

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found." });
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
      // Respond with user data
      res.status(200).json({ user });
    } catch (error) {
      // Handle errors
      console.error("Error retrieving user:", error);
      res.status(500).json({ message: "Failed to retrieve user." });
    }
  },

  // Additional user actions can be defined here, such as updating, deleting, or listing users.
};

module.exports = userController; // Export the userController
