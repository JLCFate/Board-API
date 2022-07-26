const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./queries");
const port = process.env.PORT || 4000;

const corsOpts = {
	origin: "*",
	methods: ["GET", "POST", "DELETE", "PUT"],
	allowedHeaders: ["Content-Type", "X-Address"],
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

// iOS handler

app.post("/ios/user", db.askForAccess);
app.get("/ios/user", db.checkiOSAccess);
app.get("/ios/gate", db.sendOpenGateImpulse);

app.listen(port, () => {
	console.log(`App running on port ${port}.`);
});
