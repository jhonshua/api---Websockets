const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

module.exports.login = async (req, res) => {
  const { username, password } = req.body
  const foundUser = await User.findOne({ username })
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password)
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          res
            .cookie('token', token, { sameSite: 'none', secure: true })
            .status(200)
            .json({ id: foundUser._id, message: 'logged in session' })
        }
      )
    } else {
      res.status(400).json({ message: 'pass error' })
    }
  } else {
    res.status(400).json({ message: 'user no found' })
  }
}

module.exports.logout = async (req, res) => {
  res
    .cookie('token', '', { sameSite: 'none', secure: true })
    .json('ok')
    .status(200)
}
