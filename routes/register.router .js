const { register } = require('../controllers/register.controller')
const express = require('express')
const router = express.Router()

router.route('/register').post(register)
module.exports = router
