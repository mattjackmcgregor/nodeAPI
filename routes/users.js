const express = require('express')
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
 
} = require('../controllers/users')

//bring in ser model
const User = require('../models/User')

//advanced middleware
const advancedResults = require('../middleware/advancedResults')
const {protect, authorize} = require('../middleware/auth')

const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

router.route('/')
  .get(advancedResults(User), getAllUsers)
  .post(createUser)


router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

module.exports = router