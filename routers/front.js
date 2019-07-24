const express = require('express')
const Category = require('../models/category')
const Blog = require('../models/blog')
const Comment = require('../models/comment')

const router = express.Router()


router.get('/', (req, res) => {
    let page = Number(req.query.page) || 1
    let cate = req.query.cate || ''
    data = {}
    data.cate = cate
    const pageCount = 5
    Blog.countDocuments(cate ? { category: cate } : null)
        .then((count) => {
            const pages = Math.ceil(count / pageCount) || 1
            page = Math.min(page, pages)
            page = Math.max(page, 1)
            const skipCount = (page - 1) * pageCount
            data.page = page
            data.pages = pages
            data.skipCount = skipCount
            return Blog.find(cate ? { category: cate } : null).sort({ add_time: -1 }).populate('author').limit(pageCount).skip(skipCount)
        })
        .then((blogs) => {
            data.blogs = blogs
            return Category.find()
        })
        .then((categories) => {
            const userInfo = req.userInfo || null
            console.log(data.page, data.pages);
            
            res.render('front/index', {
                categories,
                user: userInfo,
                blogs: data.blogs,
                page: data.page,
                pages: data.pages,
                cate: data.cate
            })
        })
})


// 显示博客详情
router.get('/blog', (req, res) => {
    const bid = req.query.bid || ''
    Blog.findById(bid)
    .populate('author')
    .then((blog) => {
        blog.view_count ++
        blog.save()
        Comment.find({ blog: bid })
        .populate('author')
        .sort({ add_time: -1 })
        .limit(5)
        .then((comments) => {
            res.render('front/detail', {
                blog,
                comments,
                user: req.userInfo
            })

        })

    })
})


// 处理发表评论
router.post('/comment', (req, res) => {
    const { content, bid } = req.body
    new Comment({
        content,
        blog: bid,
        author: req.userInfo.id
    }).save((err, comment) => {
        console.log(comment)
        res.json({
            code: 0,
            data: comment
        })
        // res.redirect('/blog?bid=' + bid)
    })

})


// 处理请求评论
router.get('/comment', (req, res) => {
    const count = Number(req.query.count) || 5
    const curCount = Number(req.query.cc) || 0
    const bid = req.query.bid
    console.log(curCount)
    Comment.find( bid ? { blog: bid } : null)
    .populate('author')
    .sort({ add_time: -1 })
    .skip(curCount)
    .limit(count)
    .then((comments) => {
        res.json({
            code: 0,
            data: comments
        })
    })
})
module.exports = router