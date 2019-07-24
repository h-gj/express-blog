const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Category = require('./category')
const User = require('./user')

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
        default: new Date()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    view_count: {
        type: Number,
        default: 0
    }
})

module.exports = Blog = mongoose.model('blogs', blogSchema)