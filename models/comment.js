const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = mongoose.Schema({
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports = Comment = mongoose.model('Comment', commentSchema)