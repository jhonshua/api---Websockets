const express = require('express')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const morgan = require('morgan')
const Message = require('./models/Message')
const ws = require('ws')
const fs = require('fs')
const register = require('./routes/register.router ')
const login = require('./routes/login.routes')
const people = require('./routes/people.routes')
const logout = require('./routes/login.routes')
const profile = require('./routes/profile.routes')
const message = require('./routes/messages.routes')
const { connectDB } = require('./db/db')

//config
dotenv.config()
const port = process.env.PORT
const jwtSecret = process.env.JWT_SECRET
const front_url = process.env.CLIENT_URL
const app = express()

app.use(morgan('dev'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "https://front-websockets.vercel.app/",
}))

//routes
app.use(message)
app.use(profile)
app.use(register)
app.use(people)
app.use(logout)
app.use(login)

//conect data base
connectDB()

// listen port express
const server = app.listen(port, () => {
  console.log(`Server is running in ${port}!`)
})

// web Socket
const wss = new ws.WebSocketServer({ server })

wss.on('connection', (connection, req) => {
  function notifyAboutOnlinePeople() {
    ;[...wss.clients].forEach(client => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map(c => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      )
    })
  }

  connection.isAlive = true

  connection.timer = setInterval(() => {
    connection.ping()
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false
      clearInterval(connection.timer)
      connection.terminate()
      notifyAboutOnlinePeople()
      console.log('dead')
    }, 1000)
  }, 5000)

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer)
  })

  // read username and id form the cookie for this connection
  const cookies = req.headers.cookie
  if (cookies) {
    const tokenCookieString = cookies
      .split(';')
      .find(str => str.startsWith('token='))
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1]
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err
          const { userId, username } = userData
          connection.userId = userId
          connection.username = username
        })
      }
    }
  }

  connection.on('message', async message => {
    const messageData = JSON.parse(message.toString())
    const { recipient, text, file } = messageData
    let filename = null
    if (file) {
      console.log('size', file.data.length)
      const parts = file.name.split('.')
      const ext = parts[parts.length - 1]
      filename = Date.now() + '.' + ext
      const path = __dirname + '/uploads/' + filename
      const bufferData = new Buffer(file.data.split(',')[1], 'base64')
      fs.writeFile(path, bufferData, () => {
        console.log('file saved:' + path)
      })
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      })
      console.log('created message')
      ;[...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          )
        )
    }
  })

  // notify everyone about online people (when someone connects)
  notifyAboutOnlinePeople()
})
