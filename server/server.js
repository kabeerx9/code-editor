const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/../client/dist"));
app.use((req, res, next) => {
	res.sendFile(path.join(__dirname + "/../client/dist/index.html"));
});

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
	return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
		(socketId) => {
			return {
				socketId,
				username: userSocketMap[socketId],
			};
		}
	);
};

io.on("connection", (socket) => {
	console.log("user connected", socket.id);

	socket.on("join", ({ roomId, username }) => {
		// save in server username and socketid
		userSocketMap[socket.id] = username;
		socket.join(roomId);

		// get all connected clients in room
		const clients = getAllConnectedClients(roomId);

		// send to all clients in room

		clients.forEach(({ socketId }) => {
			io.to(socketId).emit("joined", {
				clients,
				username,
				socketId: socket.id,
			});
		});
	});

	socket.on("disconnecting", () => {
		const rooms = [...socket.rooms];
		rooms.forEach((roomId) => {
			socket.in(roomId).emit("disconnected", {
				socketId: socket.id,
				username: userSocketMap[socket.id],
			});
		});

		delete userSocketMap[socket.id];
		socket.leave();
	});

	socket.on("code-change", ({ roomId, code }) => {
		// sednign same name event from the server to client
		socket.in(roomId).emit("code-change", {
			code,
		});
	});

	socket.on("sync-code", ({ socketId, code }) => {
		io.to(socketId).emit("code-change", {
			code,
		});
	});
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log(`Server listening at port ${port}`);
});
