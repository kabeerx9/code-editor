import { MobileSidebar } from "@/pages/EditorPage";
import { useEffect, useRef } from "react";
import Codemirror from "codemirror";

import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/lib/codemirror.css";
import { ACTIONS } from "@/Actions";

interface ClientsProps {
	clients: {
		socketId: number;
		username: string;
	}[];
	socketRef: React.MutableRefObject<any>;
	roomId: string | undefined;
	onCodeChange: (code: string) => void;
}

const Editor = ({ clients, socketRef, roomId, onCodeChange }: ClientsProps) => {
	const editorRef = useRef<any>(null);

	useEffect(() => {
		async function init() {
			const textArea = document.getElementById(
				"realTimeEditor"
			) as HTMLTextAreaElement;
			if (textArea) {
				editorRef.current = Codemirror.fromTextArea(textArea, {
					mode: { name: "javascript", json: true },
					theme: "dracula",
					autoCloseBrackets: true,
					autoCloseTags: true,
					lineNumbers: true,
				});
			}

			editorRef.current.on("change", (instance, changes) => {
				const { origin } = changes;
				const code = instance.getValue();
				onCodeChange(code);
				if (origin !== "setValue") {
					socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
						roomId,
						code,
					});
				}
			});
		}
		init();
	}, []);

	useEffect(() => {
		if (socketRef.current) {
			socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
				editorRef.current.setValue(code);
			});
		}

		return () => {
			socketRef.current?.off(ACTIONS.CODE_CHANGE);
		};
	}, [socketRef.current]);

	return (
		<div className="h-full">
			<div className="flex gap-4 p-2">
				<div className="md:hidden ">
					<MobileSidebar clients={clients} />
				</div>
				<div>Dark Mode</div>
			</div>
			<textarea
				id="realTimeEditor"
				className="w-full h-full border border-white text-white"
			/>
		</div>
	);
};
export default Editor;
