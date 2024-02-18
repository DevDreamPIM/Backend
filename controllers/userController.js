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
            .then(async (exists) => {
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
                    role: req.body.role
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
                        <p><strong>Epilepto Guard</strong></p>
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
                user.save();
                res.status(200).json({ id: user._id, email: user.email, image: user.image, role: user.role, firstName: user.firstName, lastName: user.lastName,phoneNumber: user.phoneNumber, token });
            } else {
                res.status(500).json('Invalid Credentials!');
            }
        })
    }
};