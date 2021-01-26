const Pool = require('pg').Pool
const pool = new Pool({
	host: '/var/run/postgresql',
	database: 'drawing-museum',
})

const getAuthors = (request, response) => {
	pool.query('SELECT * FROM authors ORDER BY author_id ASC;', (error, results) => {
		if (error) {
			response.status(500).json({error: error.toString()})
			return
		}

		response.status(200).json(results.rows)
	})
}

const createAuthor = (request, response) => {
	const { name, birthday, deathday } = request.body

	let code = 201
	let message = {
		ok: 1,
		message: "Author added",
	}

	pool.query('INSERT INTO authors (name, birthday, deathday) VALUES ($1, $2, $3)', [name, birthday, deathday], (error, results) => {
		if (error) {
			code = 500
			message = {
				message: error.toString()
			}
		}
		response.status(code).json(message)
	})
}

const getDrawings = (request, response) => {
	pool.query('SELECT drawing_id FROM drawings ORDER BY drawing_id ASC;', (error, results) => {
		if (error) {
			response.status(500).json({error: error.toString()})
			return
		}

		response.status(200).json(results.rows)
	})
}

const getDrawingHTML = (request, response) => {
	const { drawingId } = request.params

	pool.query(`
	SELECT 
		drawing_id, authors.name AS author, EXTRACT(YEAR FROM created) AS created
	FROM drawings
	JOIN authors ON authors.author_id = drawings.author_id
	WHERE drawing_id = $1;`,
		[drawingId], (error, results) => {
		if (error) {
			response.status(500).json({error: error.toString()})
			return
		}

		response.render('drawing.pug', results.rows[0])
	})
}

const getDrawingJPG = (request, response) => {
	const { drawingId } = request.params

	pool.query('SELECT picture FROM drawings WHERE drawing_id = $1 LIMIT 1;', [drawingId], (error, results) => {
		if (error) {
			response.status(500).json({error: error.toString()})
			return
		}

		response.send(results.rows[0].picture)
	})
}

const createDrawing = (request, response) => {
	const { created, author_id, picture, drawing_id } = request.body

	let code = 201
	let message = {
		ok: 1,
		message: "Drawing added",
	}

	pool.query('INSERT INTO drawings (drawing_id, picture, author_id, created) VALUES ($1, decode($2, \'base64\'), $3, $4)', [drawing_id, picture, author_id, created], (error, results) => {
		if (error) {
			code = 500
			message = {
				message: error.toString()
			}
		}
		response.status(code).json(message)
	})
}

module.exports = {
	getAuthors,
	createAuthor,
	getDrawings,
	getDrawingHTML,
	getDrawingJPG,
	createDrawing,
}
