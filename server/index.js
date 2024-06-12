const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const EmployeeModel = require("./models/Employee");
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
connectDb();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(cookieParser());

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Token not available" });
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Invalid token" });
            next();
        });
    }
};

app.get("/home", verifyUser, (req, res) => {
    return res.json("Success");
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await EmployeeModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "No record existed" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
            res.cookie("token", token);
            return res.json({ message: "Success" });
        } else {
            return res.status(400).json({ message: "The password is incorrect" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error finding user", error });
    }
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const employee = await EmployeeModel.create({ name, email, password: hash });
        res.json({ message: "User registered successfully", employee });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

app.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    EmployeeModel.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.send({Status: "User not existed"})
        } 
        const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user:  process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:5173/reset_password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
})

app.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                UserModel.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
