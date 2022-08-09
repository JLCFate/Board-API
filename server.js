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
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users/get/:address", db.queryOne);
app.get("/users/:address", db.checkUsers);
app.get("/users", db.getUsers);
app.get("/logs", db.getLogs);

app.post("/token/:type/:address", db.addDevToken);
app.post("/users", db.createUser);
app.post("/logs", db.addLogs);

app.put("/users/authenticate/:address", db.updateAuthorized);
app.put("/users/:address", db.updateUser);

app.delete("/users/:address", db.deleteUser);

app.listen(port, () => {
	console.log(`App running on port ${port}.`);
});
