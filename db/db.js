const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const mongoose_url = process.env.MONGO_URL

mongoose.set('strictQuery', false)

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(mongoose_url)
    console.log('>>> DB is connecte <<<')
  } catch (error) {
    console.log(error)
  }
}
