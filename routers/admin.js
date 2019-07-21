const express = require('express')

// 引入数据模型
const User = require('../models/user')
const Category = require('../models/category')

const router = express.Router()


// 处理超权访问
router.use((req, res, next) => {
	if (!(req.userInfo && req.userInfo.is_admin)) {
		return res.send('Unauthorized !')
	}
	next()
})


// 后台管理首页
router.get('/', (req, res) => {
	return res.render('admin/index.html')
})


// 用户列表页面
router.get('/user', (req, res) => {
	let page = Number(req.query.page) || 1
	const pageCount = 2

	User.count((err, count) => {
		const pages = Math.ceil(count / pageCount)
		// 处理page： page<1 => page=1	page>pages => page=pages
		page = Math.max(page, 1)
		page = Math.min(page, pages)
		const skipCount = (page - 1) * pageCount

		User.find()
			.limit(pageCount)
			.skip(skipCount)
			.then((users) => {
				res.render('admin/user_index.html', {
					page,
					pages,
					count,
					pageCount,
					item: 'user',
					users: users
				})
			})
	})
})


// 分类列表页面
router.get('/catelist', (req, res) => {
	let page = Number(req.query.page) || 1
	const pageCount = 3
	Category.count((err, count) => {
		const pages = Math.ceil(count / pageCount)
		// 处理page： page<1 => page=1	page>pages => page=pages
		page = Math.max(page, 1)
		page = Math.min(page, pages)
		const skipCount = (page - 1) * pageCount

		Category.find()
			.limit(pageCount)
			.skip(skipCount)
			.then((cates) => {
				res.render('admin/cate_list', {
					page,
					count,
					pages,
					pageCount,
					item: 'catelist',
					categories: cates
				})
			})
	})
})


// 分类添加页面
router.get('/category', (req, res) => {
	res.render('admin/category')
})


// 处理分类添加
router.post('/category', (req, res) => {
	const category = req.body.name || ''
	if (category === '') {
		return res.render('admin/error', {
			message: 'Category name is required.'
		})
	}

	Category.findOne({ name: req.body.name })
		.then((cate) => {
			if (cate) {
				return res.render('admin/error', {
					message: 'Category already exists.'
				})
			}
			new Category(req.body).save()
			res.render('admin/success', {
				message: 'Category added successfully.'
			})
		})
})

module.exports = router