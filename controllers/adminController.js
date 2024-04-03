import Feedback from '../models/feedback.js';
import User from '../models/user.js';

export function addFeedback(req, res) {
    Feedback.create({
            userId: req.body.id,
            feedback: req.body.feedback,
        }).then(() => {
            res.status(201).json(req.body.feedback);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });

        })
}

export function getUsers(req, res) {
    User.find({}).then(patients => {
        res.status(200).json({ data: patients });
    }).catch(err => {
        res.status(500).json({ message: err })
    });
};


export function getFeedback(req, res) {
    User.find({ userId: req.params.id }).then(feedback => {
        res.status(200).json({ data: feedback });
    }).catch(err => {
        res.status(500).json({ message: err })
    });
};