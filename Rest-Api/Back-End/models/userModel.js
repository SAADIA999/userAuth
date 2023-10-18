const mongoose = require('mongoose');
bcrypt = require('bcrypt');


// create schema
const UserSchema = new mongoose.Schema({ 
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role : {
            type : String,
            required: false,
            enum : ['user','admin'],
            default: 'user'
    
        }
    });

// const user = mongoose.model("User", UserSchema);


module.exports = mongoose.model("User", UserSchema);