const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config()
const connectDb = require("./config/dbConnection")
const EmployeeModel = require("./models/Employee")

connectDb();

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())


app.post('/login',(req,res) => {
    const {email,password} = req.body;
    EmployeeModel.findOne({email: email})
    .then(user => {
        if(user){
            if(user.password === password){
                res.json("Success")
            } else {
                res.json("The password is incorrect")
            }
        } else {
            res.json("No record existed")
        }
        
    
    })
})


app.post('/register',(req,res) => {
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err =>res.json(err))
})




app.listen(port,() => {
    console.log(`Server running on port ${port}`);
})

