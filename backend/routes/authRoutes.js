// routes/authRoutes.js
const express = require('express');
const { registerUser, registerAdmin, loginUser, loginAdmin, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/admin', registerAdmin);
router.post('/login/user', loginUser);
router.post('/login/admin', loginAdmin);
router.get('/logout', logout);

module.exports = router;

