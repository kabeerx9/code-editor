import { io } from "socket.io-client";

const URL = window.location.hostname;

export const initSocket = async () => {
	const options = {
		"force new connection": true,
		reconnectionAttempts: Infinity,
		timeout: 10000,
		transports: ["websocket"],
	};
	return io(URL, options);
};
