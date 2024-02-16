import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generate } from '../middlewares/generate-avatar.js';
import { validationResult } from "express-validator";

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
                        return res.status(400).json({ message: 'Email already exists' });
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

                    res.status(201).json(newUser);
                })
                .catch(error => {
                    res.status(500).json({ message: error.message });

                })
        }
    }