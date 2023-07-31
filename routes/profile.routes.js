const { profile } = require('../controllers/profile.controller')
const express = require('express')
const router = express.Router()

router.route('/profile').get(profile)
module.exports = router
