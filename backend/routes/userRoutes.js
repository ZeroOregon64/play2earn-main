const express = require('express');
const UserModel = require('../models/User');
// mit prajapati (auth)
const nodemailer = require("nodemailer");
const { request } = require("http");
require("dotenv").config();
const crypto = require("crypto");


const { getUserProfile, updateUserProfile, deleteUser, getAllUsers, sign_up, log_in, requestUserPasswordReset, passwordSet } = require('../controllers/userController');

const router = express.Router();
// router.use(express.json());

router.get('/:id', getUserProfile);
router.patch('/:id', updateUserProfile);
router.delete('/:id', deleteUser);
router.get('/', getAllUsers);

// mit prajapati (authentication system)

// code for generating the reference code...
function generateReferralCode(firstName, lastName) {
    const data = `${firstName}-${crypto.randomInt(100000, 999999)}-${lastName}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');

    // Truncate the hash to the first 8 characters (you can choose a different length)
    const referralCode = hash.substring(0, 10);
    return referralCode;
}


router.post("/sign_up", (request, response) => {
    const { firstName, lastName, email, password, refBy } = request.body;

    const username = firstName + crypto.randomInt(100000, 999999);
    // Check if a user with the given email already exists
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // If the user is found, send a response indicating the email is already in use
                return response.status(400).json({ error: "Email already exists" });
            } else {
                // Generate the referral code and create the new user
                const userRefNum = generateReferralCode(firstName, lastName);

                UserModel.create({ firstName, lastName, username, email, password, userRefNum, refBy })
                    .then(newUser => response.status(201).json(newUser))
                    .catch(err => {
                        console.error("Error creating user:", err);
                        response.status(500).json({ error: "Error creating user" });
                    });
            }
        })
        .catch(err => {
            console.error("Error finding user:", err);
            response.status(500).json({ error: "Error finding user" });
        });
});

// else {
//     const userRefNum = generateReferralCode(firstName, lastName)
//     // console.log(userRefNum)

//     UserModel.create({firstName, lastName, email, password, userRefNum, refBy})
//         .then(users => response.json(users))
//         .catch(err => response.json(err));
// }
// });

router.post("/log_in", (request, response) => {
    const { email, password } = request.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    response.json("success");
                } else {
                    response.json("The credentials are incorrect");
                }
            } else {
                response.json("User doesn't exist");
            }
        });
});



router.post("/requestUserPasswordReset", (request, response) => {
    const { email } = request.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                const otp = crypto.randomInt(100000, 999999);
                user.otp = otp;
                user.otpExpires = Date.now() + 3600000; // 1 hour

                user.save();
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "playearnai.noreply@gmail.com",
                        pass: "htcspcsiaiykuklx"
                    }
                });

                const mailOptions = {
                    to: user.email,
                    from: process.env.EMAIL,
                    subject: "Password Reset",
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                    Here is the code which you need to enter:${otp}\n\n
                    This code will be expire in one hour, and please make sure that you do not share with anyone else for security reason.
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };

                transporter.sendMail(mailOptions, (err, res) => {
                    if (err) {
                        console.error("There was an error: ", err);
                        return response.status(500).json({ error: "Failed to send email" });
                    } else {
                        return response.status(200).json({ message: "Password reset email sent" });
                    }
                });
            } else {
                return response.status(404).json({ error: "User is not found" });
            }
        })
        .catch(err => response.status(500).json({ error: err.message }));
});

router.post("/passwordSet", (request, response) => {
    const { otp, newPassword } = request.body
    UserModel.findOne({ otp: otp })
        .then(user => {
            if (otp) {
                user.password = newPassword;
                user.save()
                response.json("correct");
                response.json(user.password)
            }
            else {
                response.json("OTP is incorrect. Try again!")
            }
        })
        .catch(err => {
            response.status(500).json({ message: "Error finding user.", error: err });
        });
})

module.exports = router;