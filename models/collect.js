const mongoose = require('mongoose')

const Schema = mongoose.Schema

const collectSchema = Schema({
    blog: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    operator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})


module.exports = Collect = mongoose.model('Collect', collectSchema)