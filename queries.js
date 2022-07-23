require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: 'mac_users',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const createUser = (request, response) => {
    const { name, address } = request.body
  
    pool.query('INSERT INTO users (name, address) VALUES ($1, $2) RETURNING *', [name, address], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added`)
    })
  }  

  const updateUser = (request, response) => {
    const { name, address } = request.body
  
    pool.query(
      'UPDATE users SET name = $1, address = $2 WHERE address = $3',
      [name, address],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified`)
      }
    )
  }

  const deleteUser = (request, response) => {
    const address = parseInt(request.params.address)
  
    pool.query('DELETE FROM users WHERE address = $1', [address], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted`)
    })
  }  
  module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  }