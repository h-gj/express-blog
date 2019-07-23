const express = require('express')
const swig = require('swig')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Cookies = require('cookies')

const User = require('./models/user')

const app = express()


app.engine('html', swig.renderFile)
app.set('views', './views')
app.set('view engine', 'html')
swig.setDefaults({ cache: false })

app.use((req, res, next) => {
	req.cookies = new Cookies(req, res)
	const userId = req.cookies.get('userId')
	// req.userInfo = {}
	if (userId) {
		User.findById(userId, function(err, ret){
			req.userInfo = ret
			next()
		})
	} else{
		next()
	}
	
})

// 设置静态文件托管
app.use('/public', express.static('./public'))
app.use('/node_modules', express.static('./node_modules'))
app.use(bodyParser.urlencoded({ extended: true }))

// 根据路由划分模块
app.use('/', require('./routers/front'))
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))

mongoose.connect('mongodb://localhost/express-blog', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Failed to connect to mongodb.')
    } else {
        app.listen(5000, () => {
            console.log('Server is listening on port 5000...')
        })
    }
})