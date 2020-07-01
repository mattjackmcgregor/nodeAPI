const express = require('express')
const { registerUser, loginUser, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout} = require('../controllers/auth')

//protect middleware
const {protect, authorize} = require('../middleware/auth')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/me').get(protect, getMe)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)
router.route('/updatedetails').put(protect, updateDetails)
router.route('/updatepassword').put(protect, updatePassword)

module.exports = router