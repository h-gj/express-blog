const mongoose = require('mongoose')

const Schema = mongoose.Schema

const blogSchema = new Schema({
    category: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }
})

module.exports = Blog = mongoose.model('blogs', blogSchema)