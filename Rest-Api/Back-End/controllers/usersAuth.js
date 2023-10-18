const jwt = require('jsonwebtoken')
const express = require("express")
const app = express()
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
// const User = require('../models/userModel')
const User = require('../models/userModel')

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('all Field are required')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('Email Already Used')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      // assign a token to the user that will expire in 30d
      token: generateToken(user._id),
      message:`Welcome ${user.name} you are  Signed Up Successfully`,
    })

  } else {

    res.status(400)
    throw new Error('Invalid user data')
  }
})
//
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

const refreshToken = (id)=>{
  return jwt.sign({id},process.env.REFRESH_TOKEN_SECRET,{
    expiresIn : '1d',
  })
}

const profile = asyncHandler(async (req, res) => {
  res.status(200).json( {message : `Hello  ${req.user.name} You are Authorised and here is your data : ${req.user}`})
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateToken(user._id);
    // console.log(accessToken)
    const refreshtoken = refreshToken(user._id)
    // console.log(refreshtoken);k
    res.cookie('jwt',accessToken,{
      httpOnly:true,
      // secure:true,
      sameSite:'None',
      maxAge : 7 * 24 * 60 * 60 * 1000 // 

    })
    res.cookie('jwt_refresh',refreshtoken,{
      httpOnly:true,
      // secure:true,
      sameSite:'None',
      maxAge : 7 * 24 * 60 * 60 * 1000 

    })
    // res.json({accessToken})
    res.status(201).json({
      message :`Hello ${user.name} ! you logged successfully`,
      _id: user.id,
      name: user.name,
      email: user.email,
      // Display The Token That Has Been Assigned to teh suer after the login 
      Token: accessToken,
      refereshToken : refreshtoken
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

//LogOUt Function 


// Refresh The Token :
// const refresh = (req,res)=>{
//   const cookies = req.cookies
//   console.log(cookies)
//   // console.log(cookies.jwt.Token)
//   if(!cookies?.jwt) return res.status(401).json({message : "Unauthorized"})
//   const refreshtoken = cookies.jwt
//   console.log(refreshtoken)
//   jwt.verify(
//     refreshtoken,
//     process.env.REFRESH_TOKEN_SECRET,
//     asyncHandler(async(err,decoded)=>{
//       if(err) return res.status(401).json({message : 'Forbidden'})
//       const foundUser = await User.findById(decoded._id)
//       if(!foundUser) return res.status(401).json({message:'Unauthorized'})
//       const accessToken = generateToken(foundUser._id)
//       res.json({accessToken})

//     })
//   )
// }


const refresh = async (req, res) => {
  // console.log(req)
  if (!req.cookies || !req.cookies.jwt) {
    return res.status(401).json({ message: "Unauthorized1 " });
  }

  const refreshtoken =   req.cookies.jwt_refresh;
// console.log(refreshtoken);
  jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Forbidden' });
    }
    const foundUser = await User.findById(decoded.id);
    if (!foundUser) {
      return res.status(401).json({ message: 'Unauthorized2' });
    }

    const accessToken = generateToken(foundUser.id);
    return res.json({ accessToken });
  });
}



//LoGout Function
const logout = (req,res)=>{
  const cookies = req.cookies
  if(!cookies?.jwt) return res.status(204) // no content 
  res.clearCookie('jwt', { httpOnly : true , sameSite : 'None'})
  res.clearCookie('jwt-refresh', { httpOnly : true , sameSite : 'None'})

  res.json({ message : 'cookie Cleared  && you Are Logout'})
}

// const logOut = async (req, res) => {
//   res.clearCookie("access_token").status(200).json({message : "Logout successfully"});
// }

// Update User - METHOD: PUT
// const updateUser = async (req, res) => {
//   try {
//       const user = await User.findByIdAndUpdate(req.params.UserID, req.body, { new: true });
//       if (!user) return res.status(404).send("User not found");
//       res.json(user);
//   } catch (err) {
//       res.status(500).send(err.message);
//   }
// };

// Delete User - METHOD: DELETE
// const deleteUser = async (req, res) => {
//   try {
//       await User.findByIdAndDelete(req.params.UserID);
//       res.status(204).send(); 
//   } catch (err) {
//       res.status(500).send(err.message);
//   }
// };


module.exports = {
  registerUser,
  loginUser,
  profile,
  refresh,
  logout
}