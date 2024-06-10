const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const EmployeeModel = require("./models/Employee");
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

connectDb();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    EmployeeModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.json({ message: "No record existed" });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: "Error during password comparison" });
                }

                if (isMatch) {
                    return res.json({ message: "Success" });
                } else {
                    return res.json({ message: "The password is incorrect" });
                }
            });
        })
        .catch(error => {
            return res.status(500).json({ message: "Error finding user", error });
        });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10)
        .then(hash => {
            EmployeeModel.create({ name, email, password: hash })
                .then(employee => res.json({ message: "User registered successfully", employee }))
                .catch(err => res.status(500).json({ message: "Error creating user", error: err }));
        })
        .catch(err => res.status(500).json({ message: "Error hashing password", error: err.message }));
});

app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    EmployeeModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.json({ message: "User not found" });
            }

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'youremail@gmail.com',
                    pass: 'yourpassword'
                }
            });

            var mailOptions = {
                from: 'youremail@gmail.com',
                to: email,
                subject: 'Reset your password',
                text: 'That was easy!'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Error sending email", error });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.json({ message: 'Email sent: ' + info.response });
                }
            });
        })
        .catch(error => {
            return res.status(500).json({ message: "Error finding user", error });
        });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
