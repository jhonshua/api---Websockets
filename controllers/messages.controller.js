const Message = require('../models/Message')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err
        resolve(userData)
      })
    } else {
      reject('no token')
    }
  })
}

module.exports.messages = async (req, res) => {
  const { userId } = req.params
  const userData = await getUserDataFromRequest(req)
  const ourUserId = userData.userId
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 })
  res.json(messages)
}
