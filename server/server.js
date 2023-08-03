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
	socket.on("new-message", (message, room) => {
		if (room) {
			socket.to(room).emit("new-message", message);
		} else {
			socket.broadcast.emit("new-message", message);
		}
	});

	// TODO: may need to leave rooms before joining new rooms with socket.leave(room)
	socket.on("join-room", async (room) => {
		socket.join(room);
		console.log(socket.rooms);
		let socks = await io.in(room).fetchSockets();
		socks = socks.map((s) => s.id);
		console.log(socks)
	});

	socket.on("correct-guess", (room) => {
		if (room) {
			socket.to(room).emit("correct-guess");
		}
	});

	socket.on("give-up", (room) => {
		if (room) {
			socket.to(room).emit("give-up");
		}
	});
});
  
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
