const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(process.env.DB_URL)
        console.log(`Databse is connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Db not Connected")
    }
}

module.exports = connectDB