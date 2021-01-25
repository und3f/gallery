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
	createDrawing,
}
