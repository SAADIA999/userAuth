
const express = require('express');
const {authorization} = require('../config/middlewares')
const router = express.Router();
// const  { 
//     getUsers,
//     getUser,
//     createUser,
//     updateUser,
//     deleteUser 
// } = require('../controllers/userController')
const {
  registerUser,
  loginUser,
  profile,
  refresh,
  logout
  } = require('../controllers/usersAuth')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/refresh', refresh)
router.get('/profile',authorization , profile )
router.post('/logout',logout)



module.exports = router



// module.exports = router;