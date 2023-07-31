const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

module.exports.profile = (req, res) => {
  const token = req.cookies?.token
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err
      res.json(userData)
    })
  } else {
    res.status(401).json('no token')
  }
}
