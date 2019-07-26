const express = require('express')
const Category = require('../models/category')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const Collect = require('../models/collect')

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
            blogs.forEach(element => {
                Comment.find({ blog: element.id }).then(((comments) => {
                    element.comment_count = comments.length
                }))
            });
            data.blogs = blogs
            return Category.find()
        })
        .then((categories) => {
            const userInfo = req.userInfo || null
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
    data = {}
    Blog.findById(bid)
    .populate(['author', 'category'])
    .then((blog) => {
        blog.view_count ++
        blog.save()
        data.blog = blog
        return Comment.countDocuments({ blog: data.blog.id })
    .then((commentCount) => {
        data.commentCount = commentCount
        return Blog.countDocuments({ author: data.blog.author.id })
    })
    .then((blogCount) => {
        res.render('front/detail', {
            blog: data.blog,
            commentCount: data.commentCount,
            user: req.userInfo,
            blogCount
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
        res.json({
            code: 0,
            data: comment
        })
    })
})


// 显示收藏列表
router.get('/collectlist', (req, res) => {
    const uid = req.query.uid || ''
    Collect.find({ operator: uid })
    .sort({ _id: -1 })
    .populate('blog')
    .then((collections) => {
        res.render('front/collectlist', {
            user: req.userInfo,
            collections
        })

    })
})


module.exports = router