const express = require('express')
const { login } = require('../controllers/login.controller')
const { logout } = require('../controllers/login.controller')
const router = express.Router()

router.route('/login').post(login)
router.route('/logout').post(logout)

module.exports = router
