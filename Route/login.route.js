const express = require('express');  // Import Express to create the router
const router = express.Router();    // Create a new router instance
const loginController = require('./login.controller');  // Import the login controller

// Define the route for login
router.post('/login', loginController.loginUser);  // When a POST request is made to /api/login, it triggers the loginUser function from the controller

module.exports = router;  // Export the router to be used in the main app