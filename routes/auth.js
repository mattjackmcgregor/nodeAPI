const express = require('express')
const { registerUser, loginUser, getMe } = require('../controllers/auth')

//protect middleware
const {protect} = require('../middleware/auth')

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/me').get(protect, getMe)

module.exports = router