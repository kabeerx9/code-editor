import { io } from "socket.io-client";

const URL = "http://localhost:3000";

export const initSocket = async () => {
	const options = {
		"force new connection": true,
		reconnectionAttempts: Infinity,
		timeout: 10000,
		transports: ["websocket"],
	};
	return io(URL, options);
};
