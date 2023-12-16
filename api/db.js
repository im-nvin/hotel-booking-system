const mongoose = require('mongoose');
const MONGO_URL = `mongodb+srv://naveen:naveen@cluster0.0edyaql.mongodb.net/hotel?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL, { useUnifiedtopology: true, useNewUrlParser: true })
var connection = mongoose.connection
connection.on('error', () => {
    console.log("Mongo DB connection failed")
})
connection.on('connected', () => {
    console.log("Mongo DB connection successfully")
})

module.exports = mongoose