const mongoose = require('mongoose')

mongoose
    .connect('mongodb://root:example@mongo:27017/cinema?authSource=admin', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db