const express = require('express')

const router = express.Router()


router.get('/', (req, res) => {
    const userInfo = req.userInfo
    if (userInfo) {
    	res.render('front/index', { user: userInfo })
    } else {
    	res.render('front/index', { user: null})
    }
})


module.exports = router