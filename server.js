const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./queries");
const port = process.env.PORT || 4000;

const corsOpts = {
	origin: "*",

	methods: ["GET", "POST", "DELETE", "PUT"],

	allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.get("/users", db.getUsers);
app.post("/users", db.createUser);
app.put("/users/:address", db.updateUser);
app.delete("/users/:address", db.deleteUser);
app.get("/logs", db.getLogs);
app.get("/users/:address", db.checkUsers);
app.put("/users/authenticate/:address", db.updateAuthorized);

app.listen(port, () => {
	console.log(`App running on port ${port}.`);
});
