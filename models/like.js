const mongoose =  require('mongoose')

const Schema = mongoose.Schema

const likeSchema = Schema({
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    operator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = Like = mongoose.model('Like', likeSchema)