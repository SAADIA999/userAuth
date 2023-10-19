const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require("cookie-parser");
const colors = require ('colors')
const PORT = process.env.PORT || 5000
const app = express();
const {errorHandler} = require('./utils/errorHandler')
const connectDB = require('./config/db')



app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended : false }))
app.get('/api/users',(req,res)=>{
    res.json({message : 'Get Users' })
})


console.log("hello")
console.log("hello world")

app.use(errorHandler)
connectDB()


app.use('/api/users', require('./routes/userRoutes'));

// app.use('api/users',require('./routes/userRoutes'))
app.get("/", (req, res) => {
    // console.log(req.cookies)
    res.json({ message: "Welcome to MERN application." });
  });

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}....`.bgCyan.underline)
})