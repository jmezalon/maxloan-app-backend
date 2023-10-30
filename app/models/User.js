// app/models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  birthday: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Check if the user is 18 years or older
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return age >= 18;
      },
      message: "User must be 18 years or older.",
    },
  },
  isEmployed: {
    type: Boolean,
    default: false,
  },
  income: {
    type: Number,
    default: null, // Default value is null to indicate it's not provided yet
  },
  emailVerificationToken: String, // Token to verify email
  isEmailVerified: {
    // Email verification status
    type: Boolean,
    default: false,
  },
  emailVerificationExpiry: Date, // Expiry date of email verification token
});

userSchema.plugin(uniqueValidator);

// Hash the user's password before saving it to the database
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      const saltRounds = 10; // Number of salt rounds for bcrypt
      const hash = await bcrypt.hash(user.password, saltRounds);
      user.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
});

// Custom method to compare a password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
