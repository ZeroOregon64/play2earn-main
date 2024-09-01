const UserModel = require('../models/User');
// mit prajapati (auth)
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const { request } = require("http");
require("dotenv").config();
const crypto = require("crypto");

// Get a user's profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a user's profile
exports.updateUserProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password', 'profile_pic_url', 'tasks_completed', 'total_rewards'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// List all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// authentication (Mit Prajapati)

// app.use(cors({
//     origin: 'http://localhost:5173'
// }));
// const app = express();
// app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/Users_1214522145522121");

// exports.sign_up = async (request, response) => {
//     UserModel.create(request.body)
//     user.save()
//         .then(users => response.json(users))
//         .catch(err => response.json(err));
// };

// exports.log_in = (request, response) => {
//     const { email, password } = request.body;
//     UserModel.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 if (user.password === password) {
//                     response.json("success");
//                 } else {
//                     response.json("The credentials are incorrect");
//                 }
//             } else {
//                 response.json("User doesn't exist");
//             }
//         });
// };

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// exports.requestUserPasswordReset = (request, response) => {
//     const { email } = request.body;
//     UserModel.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 const otp = crypto.randomInt(100000, 999999);
//                 user.otp = otp;
//                 user.otpExpires = Date.now() + 3600000; // 1 hour

//                 user.save();

//                 const mailOptions = {
//                     to: user.email,
//                     from: process.env.EMAIL,
//                     subject: "Password Reset",
//                     text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//                     Here is the code which you need to enter:${otp}\n\n
//                     This code will be expire in one hour, and please make sure that you do not share with anyone else for security reason.
//                     If you did not request this, please ignore this email and your password will remain unchanged.\n`
//                 };

//                 transporter.sendMail(mailOptions, (err, res) => {
//                     if (err) {
//                         console.error("There was an error: ", err);
//                         return response.status(500).json({ error: "Failed to send email" });
//                     } else {
//                         return response.status(200).json({ message: "Password reset email sent" });
//                     }
//                 });
//             } else {
//                 return response.status(404).json({ error: "User is not found" });
//             }
//         })
//         .catch(err => response.status(500).json({ error: err.message }));
// };

// exports.passwordSet = (request, response) => {
//     const { otp, newPassword } = request.body
//     UserModel.findOne({ otp: otp })
//         .then(user => {
//             if (otp) {
//                 user.password = newPassword;
//                 user.save()
//                 response.json("correct");
//                 response.json(user.password)
//             }
//             else {
//                 response.json("OTP is incorrect. Try again!")
//             }
//         })
//         .catch(err => {
//             response.status(500).json({ message: "Error finding user.", error: err });
//         });
// }

// app.listen(3001, () => {
//     console.log("Server is running on port 3001");
// });
