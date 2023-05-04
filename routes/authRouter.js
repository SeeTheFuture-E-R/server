const express = require("express");
authRoutes = express.Router();
const authController = require("../controllers/authController");

authRoutes.post('/register', authController.register)
authRoutes.post('/login', authController.login)
module.exports = authRoutes
