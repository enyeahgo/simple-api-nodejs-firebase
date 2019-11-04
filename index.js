const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const router = require('./routes/user.js')

app.use(router)
app.use(express.static('./public'))

var PORT = process.env.port || 8888;
app.listen(PORT, () => {
	console.log('REST API running and listening at port: ' + PORT)
})