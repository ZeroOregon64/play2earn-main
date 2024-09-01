// const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your User model is defined here
// const JWT_SECRET = process.env.JWT_SECRET; // Replace with your actual JWT secret key
const Admin = require('../models/admin');
// Middleware function to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
    // const token = req.headers.authorization; // Authorization header should contain "Bearer <token>"

    // if (!token) {
    //     return res.status(401).json({ error: 'Unauthorized: No token provided' });
    // }

    // jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
    //     if (err) {
    //         return res.status(403).json({ error: 'Forbidden: Invalid token' });
    //     }
    //     req.user = decoded;
        next();
    // });
};

// Middleware function to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Forbidden: Not an admin' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    authenticateJWT,
    isAdmin
};
