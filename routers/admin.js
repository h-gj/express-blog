const express = require('express')

const User = require('../models/user')

const router = express.Router()


router.use((req, res, next) => {
	if (!(req.userInfo && req.userInfo.is_admin)) {
		return res.send('Unauthorized !')
	}
	next()
})

router.get('/', (req, res) => {
	return res.render('admin/index.html')
})

router.get('/user', (req, res) => {
	User.find()
	.then((ret) => {
		res.render('admin/user_index.html', { users: ret})
	})
	
})

module.exports = router