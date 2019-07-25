const mongoose = require('mongoose')

const Schema = mongoose.Schema


const blogSchema = Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    view_count: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})


module.exports = Blog = mongoose.model('Blog', blogSchema)
