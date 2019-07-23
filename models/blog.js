const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Category = require('./category')

const blogSchema = new Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Category
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
    },
    add_time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Blog = mongoose.model('blogs', blogSchema)