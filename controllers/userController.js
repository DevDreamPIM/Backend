import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generate } from '../middlewares/generate-avatar.js';
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';


// Register a new user
export function register(req, res) {
    if (!validationResult(req).isEmpty()) {
        console.log({ errors: validationResult(req).array() })
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {
        // At this point, req.file will contain information about the uploaded image
        const fullName = `${req.body.firstName} ${req.body.lastName}`;
        const randomColors = [
            '#FFC3A0', '#FFD8B8', '#FFECCE', '#FFF7E6', '#E0F9FF',
            '#D0FFEB', '#C6FFD0', '#FFF5E6', '#F3FFEC', '#FFE6F0',
            '#FDE0DC', '#FFF0E6', '#E6F9FF', '#E6FFED', '#F3F9FF',
            '#E6FAFF', '#F0F0FF', '#FAF0FF', '#FFF0FA', '#F0FAFF',
            '#F4F0FF', '#FFF0F4', '#FFFAF0', '#FAFFF0', '#F0FFF4',
            '#F0FFF0', '#FAF4FF', '#FFFAF4', '#F4FFFA', '#FFF4FA',
            '#F4F4FF', '#FFF4F4', '#F4FFFF', '#FFFFF4', '#FFFFFF'
        ];

        const email = req.body.email;

        User.findOne({ email })
            .then(async(exists) => {
                if (exists) {
                    return res.status(409).json({ message: 'Email already exists' });
                }
                // Generate the image filename
                const imageFilename = generate(fullName, {
                    width: 512,
                    palette: randomColors,
                    fontProportion: 0.6
                });
                // Create a new user with the image filename
                const hashedPassword = bcrypt.hashSync(req.body.password);
                const newUser = await User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    password: hashedPassword,
                    resetCode: 0,
                    image: imageFilename,
                    role: req.body.role,
                    isActivated: 1
                });
                // Send a welcome email to the user
                sendEmail({
                    to: email,
                    subject: 'Welcome to Epilepto-Guard',
                    text: `
                    <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
                    <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                        <tr>
                            <td style='padding: 20px;'>
                                <h2 style='color: #333;'>Welcome to Epilepto-Guard</h2>
                                <p>Dear ${req.body.firstName} ${req.body.lastName},</p>
                                
                                <p>Thank you for signing up with us. We are glad to have you on board. You can now log in to your account and start using our services.</p>
                                <p>Best regards,</p>
                        <p><strong>Epilepto Guard Team</strong></p>
                            </td>
                        </tr>
                    </table>
                </body>`
                });

                res.status(201).json(newUser);
            })
            .catch(error => {
                res.status(500).json({ message: error.message });

            })
    }
}

export function login(req, res) {
    const { email, password } = req.body;

    console.log(email, password)
    if (!(email && password)) {
        return res.status(400).json("All inputs is required");
    } else {
        User.findOne({ email: email }).then(user => {

            if (user && (bcrypt.compareSync(password, user.password))) {

                const token = jwt.sign({ userId: user._id, email },
                    process.env.JWT_SECRET, {
                        expiresIn: "2h",
                    }
                );
                user.isActivated = 1;


                user.save();
                res.status(200).json({ id: user._id, isActivated: user.isActivated, email: user.email, image: user.image, role: user.role, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber, token });
            } else {
                res.status(500).json('Invalid Credentials!');
            }
        })
    }
}

export async function sendActivationCode(req, res) {
    try {
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        const email = req.body.email
        const user = await User.findOne({ email });
        const username = user.firstName + " " + user.lastName;
        console.log(email);


        sendEmail({
            to: email,
            subject: 'Epilepto-Guard Activation Code',
            text: `
            <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
                <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                    <tr>
                        <td style='padding: 20px;'>
                            <h2 style='color: #333;'>Activation Code Email</h2>
                            <p>Dear ${username},</p>
                            <p>Your activation code is: <strong style='color: #009688;'>${resetCode}</strong></p>
                            <p>Please use this code to reset your password.</p>
                            <p>If you did not request this code, please disregard this email.</p>
                            <p>Thank you!</p>
                            <p><strong>Epilepto Guard Team</strong></p>
                        </td>
                    </tr>
                </table>
            </body>
        `
        });

        User.updateOne({
            email: req.body.email,
            resetCode: resetCode
        }).then(() => {
            res.status(200).json({ email: req.body.email, resetCode });
        });
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
}

export async function verifyCode(req, res) {
    const { resetCode, email } = req.body;
    const user = await User.findOne({ email: email });
    console.log(resetCode)

    if (!user) {
        res.status(404).json({ message: 'User not found' });
    } else if (resetCode === null || resetCode === undefined) {
        res.status(400).json({ message: 'resetCode is null or undefined' });
    } else if (resetCode == user.resetCode) {
        res.status(200).json({ message: 'true' });
    } else {
        res.status(400).json({ message: 'false' });
    }
}


export async function resetPassword(req, res) {

    const { email, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (newPassword == "" || confirmPassword == "")
        res.status(500).json({ message: "fields empty" });

    else if (newPassword === confirmPassword) {
        var pass = bcrypt.hashSync(req.body.newPassword);

        var password = { password: pass };
        User.updateOne(user, password)
            .then(() => {
                sendEmail({
                    to: email,
                    subject: 'Epilepto-Guard Password Reset',
                    text: `
                    <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
                    <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                        <tr>
                            <td style='padding: 20px;'>
                                <h2 style='color: #333;'>Password Reset</h2>
                                <p>Dear ${user.firstName} ${user.lastName},</p>
                                <p>Your password has been reset successfully.</p>
                                <p>If you did not request this change, please contact us immediately.</p>
                                <p>Thank you!</p>
                                <p><strong>Epilepto Guard Team</strong></p>
                            </td>
                        </tr>
                    </table>
                </body>
                `
                });
                res.status(200).json({ data: req.body });
            })
            .catch(err => {
                res.status(500).json({ message: err })
            });
    } else
        res.status(500).json({ message: "2 passwords don't match" })
}

export async function updateMedicalFile(req, res) {

    if (!validationResult(req).isEmpty()) {
        console.log({ errors: validationResult(req).array() })
        return res.status(400).json({ errors: validationResult(req).array() });
    } else {

        const { birthDate, weight, height } = req.body;
        const user = await User.findOne({ email: req.user.email });
        if (user) {
            var profile = { birthDate, weight, height };
            User.updateOne(user, profile)
                .then(() => {
                    res.status(200).json({ data: req.body });
                })
                .catch(err => {
                    res.status(500).json({ message: err })
                });
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    }

}


export async function getMedicalFile(req, res) {
    try {
        const user = await User.findOne({ id: req.id });

        if (user) {
            const { firstName, lastName, weight, height, birthDate } = user;
            return res.json({
                firstName,
                lastName,
                weight,
                height,
                birthDate
            });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export function desactivateAccount(req, res) {
    const id = req.body.id;
    console.log(id);

    User.findById(id).then((user) => {

        console.log(id);
        user.isActivated = 0;
        user.save()

        return res.status(200).json({ message: 'Deactivated' });
    }).catch((err) => {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    });
}