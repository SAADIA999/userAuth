const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;


// const connectionDB = () => {
//     mongoose.connect(MONGODB_URL);
const connectDB =  async ()=>{
    try {
        const conn = await mongoose.connect(MONGODB_URL)
        console.log(`MongoDB Connected : ${conn.connection.host}`.cyan.underline);
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}
module.exports = connectDB;