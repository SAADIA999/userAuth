const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
//Get all Users METHOD :get 
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.log('Users Not Fouds')
        res.status(500).send(err.message);
    }
};

// Get Single User - METHOD: GET
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.UserID);
        if (!user) return res.status(404).send("User not found");
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// CreateUsers - Method : POST

const createUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, SECRET_KEY);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).send(err.message);
    }
};


// Update User - METHOD: PUT
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.UserID, req.body, { new: true });
        if (!user) return res.status(404).send("User not found");
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Delete User - METHOD: DELETE
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.UserID);
        res.status(204).send(); 
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser 
};