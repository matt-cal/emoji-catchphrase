const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


// connect to user-defined routes in api.js
const api = require("./api");
app.use("/api", api);

io.on("connection", (socket) => {
	socket.on("new-message", (message) => {
		socket.broadcast.emit("new-message", message);
	});
});
  
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
