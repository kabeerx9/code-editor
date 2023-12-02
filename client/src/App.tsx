import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

const App = () => {
	return (
		<div className="h-full w-full bg-gray-700  p-2">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/editor/:roomId" element={<EditorPage />} />
				</Routes>
			</BrowserRouter>
			<Toaster position="top-right" />
		</div>
	);
};

export default App;
