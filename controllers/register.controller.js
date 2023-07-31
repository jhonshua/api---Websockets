const User = require('../models/User')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

dotenv.config()

const jwtSecret = process.env.JWT_SECRET
const bcryptSalt = bcrypt.genSaltSync(10)

module.exports.register = async (req, res) => {
  const { username, password } = req.body

  const foundUser = await User.findOne({ username })

  if (!foundUser) {
    try {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt)
      const createdUser = await User.create({
        username: username,
        password: hashedPassword,
      })
      jwt.sign(
        { userId: createdUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err
          res
            .cookie('token', token, { sameSite: 'none', secure: true })
            .status(201)
            .json({
              message: 'user no found',
              id: createdUser._id,
            })
        }
      )
    } catch (err) {
      if (err) throw err
      res.status(500).json({ message: 'error' })
    }
  } else {
    res.status(400).json({ message: 'User exists' })
  }
}
