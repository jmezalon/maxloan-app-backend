const express = require("express");
const router = express.Router(); // Create a router instance
const userController = require("../controllers/userController");

// Define routes for user actions
router.post("/users", userController.createUser); // Route to create a new user
router.get("/users/:id", userController.getUserById); // Route to get a user by ID
// You can add more routes for other user actions (update, delete, list, etc.) here

module.exports = router; // Export the router
