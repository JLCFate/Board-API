require("dotenv").config();
const Pool = require("pg").Pool;

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

const queryAll = (response, status) => {
	pool.query("SELECT * FROM users WHERE NOT name='Website' AND NOT name='Controller'", (error, results) => {
		if (error) throw error;
		response.status(status).json(results.rows);
	});
};

const queryOne = (request, response) => {
	const address = request.params.address;

	pool.query("SELECT * FROM users WHERE address = $1", [address], (error, results) => {
		if (error) throw error;
		response.status(200).json(results.rows);
	});
};

const getLogs = (request, response) => {
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			pool.query("SELECT * FROM logs ", (error, results) => {
				if (error) throw error;
				response.status(200).json(results.rows);
			});
		} else response.status(401).send();
	});
};

const getUsers = (request, response) => {
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			queryAll(response, 200);
		} else response.status(401).send();
	});
};

const addDevToken = (request, response) => {
	const address = request.params.address;
	const type = request.params.type;
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1 AND dev = true", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			pool.query("SELECT * FROM users WHERE address = $1", [address], (er, re) => {
				if (re.rows.length === 0)
					pool.query(
						"INSERT INTO users (name, address, authorized, awaiting) VALUES ($1, $2, true, false) RETURNING *",
						[capitalizeFirstLetter(type), address],
						(error, results) => {
							if (error) throw error;
							response.status(200).send();
						}
					);
				else response.status(302).send();
			});
		} else response.status(401).send();
	});
};

const createUser = (request, response) => {
	const { name, address } = request.body;

	pool.query("INSERT INTO users (name, address, authorized, awaiting) VALUES ($1, $2, false, true) RETURNING *", [name, address], (error, results) => {
		if (error) throw error;
		queryAll(response, 201);
	});
};

const addLogs = (request, response) => {
	const { name, address, date, type } = request.body;
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			pool.query("INSERT INTO logs (name, address, date, type) VALUES ($1, $2, $3, $4) RETURNING *", [name, address, date, type], (error, results) => {
				if (error) throw error;
				queryAll(response, 201);
			});
		} else response.status(401).send();
	});
};

const updateUser = (request, response) => {
	const { name, address } = request.body;
	const Oldaddress = request.params.address;
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			pool.query("UPDATE users SET name = $1, address = $2 WHERE address = $3", [name, address, Oldaddress], (error, results) => {
				if (error) throw error;
				queryAll(response, 200);
			});
		} else response.status(401).send();
	});
};

const updateAuthorized = (request, response) => {
	const { authorized, awaiting } = requrest.body;
	const address = requrest.params.address;
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			pool.query("UPDATE users SET authorized = $1, awaiting = $2 WHERE address = $3", [authorized, awaiting, address], (error, results) => {
				if (error) throw error;
				queryAll(response, 200);
			});
		} else response.status(401).send();
	});
};

const deleteUser = (request, response) => {
	const address = request.params.address;
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			pool.query("DELETE FROM users WHERE address = $1", [address], (error, results) => {
				if (error) throw error;
				queryAll(response, 200);
			});
		} else response.status(401).send();
	});
};

const checkUsers = (request, response) => {
	const Oldaddress = request.params.address;
	const requestAddress = request.get("X-Address");

	pool.query("SELECT * FROM users WHERE address = $1", [requestAddress], (err, res) => {
		if (err) throw err;
		if (res.rows.length > 0) {
			pool.query("SELECT * FROM users WHERE address =$1", [Oldaddress], (error, results) => {
				if (error) throw error;
				const status = results.rows.length > 0 ? 200 : 400;
				response.status(status).json(results.rows);
			});
		} else response.status(401).send();
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
	addDevToken,
};
