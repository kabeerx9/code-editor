import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Socket } from "socket.io-client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Editor from "@/components/Editor";
import { initSocket } from "@/socket";
import { useLocation, useNavigate, useParams } from "react-router";
import { ACTIONS } from "@/Actions";

interface ClientsProps {
	clients: {
		socketId: number;
		username: string;
	}[];
}

const SidbarContent = ({ clients }: ClientsProps) => {
	const { roomId } = useParams();
	const navigate = useNavigate();

	return (
		<div className="w-full h-full  flex flex-col justify-between  ">
			<div>
				<div className="text-3xl font-semibold">NALLE LOG</div>
				<Separator />
				<div className="text-lg ml-2 mt-5 font-semibold">Connected rn : </div>
				<div className="flex flex-wrap">
					{clients.map((client) => (
						<TooltipProvider key={client.socketId}>
							<Tooltip>
								<TooltipTrigger className="p-2 m-2 rounded-lg flex-1  bg-purple-700 text-white">
									{client.username.split(" ").map((word) => word[0])}
								</TooltipTrigger>
								<TooltipContent>{client.username}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<Button
					onClick={() => {
						navigator.clipboard.writeText(roomId || "");
						toast.success("Room Id Copied");
					}}
				>
					Copy Room Id
				</Button>
				<Button
					onClick={() => {
						toast.success("Left Room");
						navigate("/");
					}}
				>
					Leave
				</Button>
			</div>
		</div>
	);
};

export const MobileSidebar = ({ clients }: ClientsProps) => {
	return (
		<Sheet>
			<SheetTrigger>
				<GiHamburgerMenu size={40} />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader></SheetHeader>
				<SidbarContent clients={clients} />
			</SheetContent>
		</Sheet>
	);
};

const EditorPage = () => {
	const socketRef = useRef<Socket | null>(null);
	const codeRef = useRef<string>("");
	const location = useLocation();
	const { roomId } = useParams();
	const reactNavigator = useNavigate();

	const [clients, setClients] = useState([]);

	const handleErrors = (err: any) => {
		console.log("socket error", err);
		toast.error("Socket connection failed , please try again");
		reactNavigator("/");
	};

	useEffect(() => {
		const init = async () => {
			socketRef.current = await initSocket();

			socketRef.current.on("connect_error", (err) => handleErrors(err));
			socketRef.current.on("connect_failed", (err) => handleErrors(err));

			socketRef.current.emit(ACTIONS.JOIN, {
				roomId,
				username: location.state?.username,
			});

			// Listening for joined event
			socketRef.current.on(
				ACTIONS.JOINED,
				({ clients, username, socketId }) => {
					// this check because we don't want that on our own
					if (username !== location.state?.username) {
						toast.success(`${username} joined the room`);
					}
					setClients(clients);
					socketRef.current?.emit(ACTIONS.SYNC_CODE, {
						code: codeRef.current,
						socketId,
					});
				}
			);

			// LISTENING FOR DISCONNECTED

			socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
				toast.error(`${username} left the room`);
				setClients((prev) =>
					prev.filter((client) => client.socketId !== socketId)
				);
			});
		};
		init();

		return () => {
			socketRef.current?.disconnect();
			socketRef.current?.off(ACTIONS.JOINED);
			socketRef.current?.off(ACTIONS.DISCONNECTED);
		};
	}, []);

	return (
		<div className="flex h-full ">
			<div className="hidden md:block bg-white md:p-2  w-1/6">
				<SidbarContent clients={clients} />
			</div>
			<div className="bg-gray-500 flex-1 h-full">
				<Editor
					socketRef={socketRef}
					roomId={roomId}
					clients={clients}
					onCodeChange={(code) => {
						codeRef.current = code;
					}}
				/>
			</div>
		</div>
	);
};

export default EditorPage;
