require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: 'mac_users',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
})
const queryAll = (response, status) => {
  pool.query('SELECT * FROM users ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(status).json(results.rows)
  })
}


const getLogs = (request, response) => {
  pool.query('SELECT * FROM logs ', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUsers = (request, response) => {
    queryAll(response, 200)
  }

  const createUser = (request, response) => {
    const { name, address } = request.body
  
    pool.query('INSERT INTO users (name, address) VALUES ($1, $2) RETURNING *', [name, address], (error, results) => {
      if (error) {
        throw error
      }
      queryAll(response, 201)
    })
  }  

  const updateUser = (request, response) => {
    const { name, address } = request.body
    const Oldaddress = request.params.address
  
    pool.query(
      'UPDATE users SET name = $1, address = $2 WHERE address = $3',
      [name, address, Oldaddress],
      (error, results) => {
        if (error) {
          throw error
        }
        queryAll(response, 200)
      }
    )
  }

  const deleteUser = (request, response) => {
    const address = request.params.address
  
    pool.query('DELETE FROM users WHERE address = $1', [address], (error, results) => {
      if (error) {
        throw error
      }
      queryAll(response, 200)
    })
  }  
  module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getLogs,
  }