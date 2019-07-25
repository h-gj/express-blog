const express = require('express')
const md5 = require('md5')

const User = require('../models/user')
const Comment = require('../models/comment')
// const Comment = require('../models/blog_comment').Comment

const router = express.Router()

router.use((req, res, next) => {
    resData = {
        code: 0,
        message: 'success'
    }
    next()
})

router.post('/user', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const confirm = req.body.confirm

    if (!username) {
        resData.code = 1001
        resData.message = 'Username is required.'
        return res.json(resData)
    }

    if (!password) {
        resData.code = 1002
        resData.message = 'Password is required.'
        return res.json(resData)
    }

    if (password != confirm) {
        resData.code = 1003
        resData.message = 'Password do not match twice.'
        return res.json(resData)
    }

    User.findOne({ username })
    .then(function(ret){
    	if (ret) {
    		resData.code = 1004
    		resData.message = 'Username already exists.'
    		return res.json(resData)
    	}
    	req.body.password = md5(md5(password))
    	const user = new User(req.body)
    	user.save()
    	res.json(resData)
    })
})



router.post('/user/login', (req, res) => {
	const username = req.body.username
    const password = req.body.password

    if (!(username && password)) {
        resData.code = 1005
        resData.message = 'Username or password can not be empty.'
        return res.json(resData)
    }

    req.body.password = md5(md5(password))
    User.findOne(req.body)
    .then(function(ret){
    	if (!ret) {
    		resData.code = 1006
        	resData.message = 'Invalid username password pair.'
    		return res.json(resData)
    	}
    	req.cookies.set('userId', ret._id)
    	resData.user = ret.username
    	res.json(resData)
    })

})

router.get('/user/logout', (req, res) => {
	req.cookies.set('userId', '')
	res.redirect('/')
})


// 处理请求评论
router.get('/comment', (req, res) => {
    const count = Number(req.query.count) || 10
    const curCount = Number(req.query.cc) || 0
    const bid = req.query.bid
    console.log(curCount)
    Comment.find( bid ? { blog: bid } : null)
    .populate('author')
    .sort({ add_time: -1 })
    .skip(curCount)
    .limit(count)
    .then((comments) => {
        Comment.countDocuments({ blog: bid })
        .then((count) => {
            res.json({
                code: 0,
                count,
                data: comments,
            })

        })
    })
})
module.exports = router