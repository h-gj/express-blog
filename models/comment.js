const mongoose = require('mongoose')

const Blog = require('./blog')
const User = require('./user')

const commentSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Blog
    },
    content: {
        type: String,
        require: true
    },
    add_time: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
})


module.exports = Comment = mongoose.model('comments', commentSchema)