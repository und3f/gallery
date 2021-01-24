const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')
const path = require('path')

const multer = require('multer');
const upload = multer();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '50mb',
		parameterLimit: 50000,
	})
)
app.use(upload.array()); 

app.use('/static', express.static(__dirname + '/public'))
app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname + '/public/index.html'));
})
app.get('/authors', db.getAuthors)
app.post('/authors', db.createAuthor)

let drawingUpload = upload.fields([
	{ name: "drawing_id"}
])

app.post('/drawings', drawingUpload, db.createDrawing)

app.listen(port, () => {
	console.log(`Ready http://localhost:${port}`)
})