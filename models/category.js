const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cateSchema = new Schema({
    name: {
        type: String,
        require: true
    }
})

module.exports = Category = mongoose.model('categories', cateSchema)
