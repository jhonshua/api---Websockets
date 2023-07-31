const { messages } = require('../controllers/messages.controller')
const express = require('express')
const router = express.Router()

router.route('/messages/:userId').get(messages)
module.exports = router
