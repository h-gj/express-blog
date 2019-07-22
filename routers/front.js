const express = require('express')
const Category = require('../models/category')

const router = express.Router()


router.get('/', (req, res) => {
    const userInfo = req.userInfo || null
    Category.find()
    .then((categories) => {
        res.render('front/index', { user: userInfo, categories })
    })
})


module.exports = router