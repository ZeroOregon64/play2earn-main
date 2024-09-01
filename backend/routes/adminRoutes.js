const express = require('express');
const Admin = require('../models/admin'); 

const router = express.Router();

// Admin login
router.post('/log_in', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Admin not found');
            return res.status(404).json({ message: 'Admin does not exist' });
        }

        if (password !== admin.password) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Incorrect password' });
        }

        console.log('Login successful');
        return res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const newAdmin = new Admin({ email, password }); 
        await newAdmin.save();
        return res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
