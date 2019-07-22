const express = require('express')

// 引入数据模型
const User = require('../models/user')
const Category = require('../models/category')
const Blog = require('../models/blog')

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
	Category.countDocuments((err, count) => {
		// 这里要对count进行处理，如果删完了
		// count==0  =>  pages==0  =>  page==0  =>  skipCount==-3  =>  程序报错
		const pages = Math.ceil((count || 1) / pageCount)
		// 处理page： page<1 => page=1	page>pages => page=pages
		page = Math.max(page, 1)
		page = Math.min(page, pages)
		const skipCount = (page - 1) * pageCount

		Category.find()
			.sort({_id: -1})
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


// 编辑分类页面
router.get('/category/edit', (req, res) => {
	const { cid, name } = req.query
	res.render('admin/category_edit', { cid, name })
})


// 处理分类更新
router.post('/category/update', (req, res) => {
	const { cid, name } = req.body
	if (!(cid && name)) {
		return res.render('admin/error', {
			message: 'Both category name and id are required.'
		})
	}
	Category.findOne({ name })
		.then((cate) => {
			if (cate) {
				return res.render('admin/error', {
					message: 'Category name exists.'
				})
			}
			Category.findOneAndUpdate({ _id: cid }, { $set: { name } })
				.then(() => {
					return res.render('admin/success', {
						message: 'Category name updated successfully.',
						url: '/admin/catelist'
					})
				})
		})
})

// 处理删除分类
router.get('/category/delete', (req, res) => {
	const cid = req.query.cid || ''
	Category.findByIdAndRemove(cid)
	.then(() => {
		return res.redirect('/admin/catelist')
	})
})




// 博客列表页面
router.get('/bloglist', (req, res) => {
	res.render('admin/bloglist')
})


// 博客添加页面
router.get('/blog', (req, res) => {
	Category.find()
	.then((categories) => {
		res.render('admin/blog', { categories })
	})
})


// 处理博客添加
router.post('/blog', (req, res) => {
	const { category, title, description, content } = req.body
	
})

module.exports = router