require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

const queryAll = (response, status) => {
	pool.query("SELECT * FROM users ", (error, results) => {
		if (error) {
			throw error;
		}
		response.status(status).json(results.rows);
	});
};

const queryOne = (response, status) => {
	const { address } = request.params.address;
	pool.query("SELECT * FROM users WHERE address = $1", [address], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(status).json(results.rows);
	});
};

const getLogs = (request, response) => {
	pool.query("SELECT * FROM logs ", (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows);
	});
};

const getUsers = (request, response) => {
	queryAll(response, 200);
};

const createUser = (request, response) => {
	const { name, address } = request.body;

	pool.query("INSERT INTO users (name, address, authorized, awaiting) VALUES ($1, $2, false, true) RETURNING *", [name, address], (error, results) => {
		if (error) {
			throw error;
		}
		queryAll(response, 201);
	});
};

const addLogs = (request, response) => {
	const { name, address, date, type } = request.body;

	pool.query("INSERT INTO logs (name, address, date, type) VALUES ($1, $2, $3, $4) RETURNING *", [name, address, date, type], (error, results) => {
		if (error) {
			throw error;
		}
		queryAll(response, 201);
	});
};

const updateUser = (request, response) => {
	const { name, address } = request.body;
	const Oldaddress = request.params.address;

	pool.query("UPDATE users SET name = $1, address = $2 WHERE address = $3", [name, address, Oldaddress], (error, results) => {
		if (error) {
			throw error;
		}
		queryAll(response, 200);
	});
};

const updateAuthorized = (requrest, response) => {
	const { authorized, awaiting } = requrest.body;
	const address = requrest.params.address;

	pool.query("UPDATE users SET authorized = $1, awaiting = $2 WHERE address = $3", [authorized, awaiting, address], (error, results) => {
		if (error) {
			throw error;
		}
		queryAll(response, 200);
	});
};

const deleteUser = (request, response) => {
	const address = request.params.address;

	pool.query("DELETE FROM users WHERE address = $1", [address], (error, results) => {
		if (error) {
			throw error;
		}
		queryAll(response, 200);
	});
};

const checkUsers = (request, response) => {
	const Oldaddress = request.params.address;
	pool.query("SELECT * FROM users WHERE address =$1", [Oldaddress], (error, results) => {
		if (error) {
			throw error;
		}
		const status = results.rows.length > 0 ? 200 : 400;
		response.status(status).json(results.rows);
	});
};

module.exports = {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	getLogs,
	queryOne,
	addLogs,
	checkUsers,
	updateAuthorized,
};
