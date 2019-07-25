const express = require('express')

// 引入数据模型
const User = require('../models/user')
const Category = require('../models/category')
const Blog = require('../models/blog')
// const Blog = require('../models/blog_comment').Blog

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
	return res.render('admin/index.html', { admin: req.userInfo })
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
					users: users,
					admin: req.userInfo
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
			.sort({ _id: -1 })
			.limit(pageCount)
			.skip(skipCount)
			.then((cates) => {
				res.render('admin/cate_list', {
					page,
					count,
					pages,
					pageCount,
					item: 'catelist',
					categories: cates,
					admin: req.userInfo
				})
			})
	})
})


// 分类添加页面
router.get('/category', (req, res) => {
	res.render('admin/category', { admin: req.userInfo })
})


// 处理分类添加
router.post('/category', (req, res) => {
	const category = req.body.name || ''
	if (category === '') {
		return res.render('admin/error', {
			message: 'Category name is required.',
			admin: req.userInfo
		})
	}

	Category.findOne({ name: req.body.name })
		.then((cate) => {
			if (cate) {
				return res.render('admin/error', {
					message: 'Category already exists.',
					admin: req.userInfo
				})
			}
			new Category(req.body).save()
			res.render('admin/success', {
				message: 'Category added successfully.',
				admin: req.userInfo
			})
		})
})


// 编辑分类页面
router.get('/category/edit', (req, res) => {
	const { cid, name } = req.query
	res.render('admin/category_edit', { cid, name, admin: req.userInfo })
})


// 处理分类更新
router.post('/category/update', (req, res) => {
	const { cid, name } = req.body
	if (!(cid && name)) {
		return res.render('admin/error', {
			message: 'Both category name and id are required.',
			admin: req.userInfo
		})
	}
	Category.findOne({ name })
		.then((cate) => {
			if (cate) {
				return res.render('admin/error', {
					message: 'Category name exists.',
					admin: req.userInfo
				})
			}
			Category.findOneAndUpdate({ _id: cid }, { $set: { name } })
				.then(() => {
					return res.render('admin/success', {
						message: 'Category name updated successfully.',
						url: '/admin/catelist',
						admin: req.userInfo
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
	let page = Number(req.query.page) || 1
	const pageCount = 3
	Blog.countDocuments((err, count) => {
		// 这里要对count进行处理，如果删完了
		// count==0  =>  pages==0  =>  page==0  =>  skipCount==-3  =>  程序报错
		const pages = Math.ceil((count || 1) / pageCount)
		// 处理page： page<1 => page=1	page>pages => page=pages
		page = Math.max(page, 1)
		page = Math.min(page, pages)
		const skipCount = (page - 1) * pageCount

		Blog.find()
			.populate(['category', 'author'])
			.sort({ _id: -1 })
			.limit(pageCount)
			.skip(skipCount)
			.then((blogs) => {
				res.render('admin/bloglist', {
					page,
					count,
					pages,
					pageCount,
					item: 'bloglist',
					blogs: blogs,
					admin: req.userInfo
				})
			})
	})
})


// 博客添加页面
router.get('/blog', (req, res) => {
	Category.find()
		.then((categories) => {
			res.render('admin/blog', { categories, admin: req.userInfo })
		})
})


// 处理博客添加
router.post('/blog', (req, res) => {
	const { category, title, desc, content } = req.body
	new Blog({
		category,
		title,
		desc,
		content,
		author: req.userInfo.id
	}).save(() => {
		res.render('admin/success', {
			message: 'Blog added successfully.',
			url: '/admin/bloglist',
			admin: req.userInfo
		})
	})

})


// 处理博客修改
router.get('/blog/update', (req, res) => {
	const bid = req.query.bid
	Blog.findById(bid)
		.then((blog) => {
			Category.find()
				.then((categories) => {
					res.render('admin/blog_edit', {
						blog,
						categories,
						admin: req.userInfo
					})
				})
		})
})


// 处理博客更新
router.post('/blog/update', (req, res) => {
	const { category, title, desc, content, bid } = req.body
	Blog.findById(bid)
		.populate('category')
		.then((blog) => {
			// 处理未修改的情况
			if (category == blog.category.id && title == blog.title &&
				desc == blog.desc && content == blog.content && bid == blog.id) {
				return res.json({ code: 0, msg: 'Blog updated successfully.'})
			}

			Blog.findByIdAndUpdate(bid, {
				$set: { category, title, desc, content }
			})
			.then((newBlog) => {
				return res.json({ code: 0, msg: 'Blog updated successfully.'})
			})
		})
})


module.exports = router