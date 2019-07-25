const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cateSchema = Schema({
    name: {
        type: String,
        require: true
    }
})

module.exports = Category = mongoose.model('Category', cateSchema)
