const { people } = require('../controllers/people.controller')
const express = require('express')
const router = express.Router()

router.route('/people').get(people)
module.exports = router
