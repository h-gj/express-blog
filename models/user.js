const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = Schema({
	username: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	is_admin: {
		type: Boolean,
		default: false
	},
	add_time: {
		type: Date,
		default: Date.now()
	}
})


module.exports = User = mongoose.model('User', userSchema)