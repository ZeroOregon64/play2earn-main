const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // mit prajapati (auth)
    firstName: {
        type: String,
        required: true,
    },

    // mit prajapati (auth)
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        sparse: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // profile_pic_url: {
    //     type: String,
    //     default: null,
    // },
    tasks_completed: {
        type: Number,
        default: 0,
    },
    total_rewards: {
        type: Number,
        default: 0,
    },
    
    // mit prajapati (auth)
    otp: {
        type: Number,
        unique: true,
    },

    // mit prajapati (auth)
    otpExpires: {
        type: Date,
        unique: true,
    },

    userRefNum: {
        type: String,
        unique: true,
    },

    refBy: {
        type: String,
        unique: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
