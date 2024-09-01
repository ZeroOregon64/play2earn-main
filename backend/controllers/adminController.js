const Admin = require('../models/admin');

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password', 'profile_pic_url']; // Add other fields as necessary
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        updates.forEach(update => {
            admin[update] = req.body[update];
        });
        await admin.save();
        res.json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
