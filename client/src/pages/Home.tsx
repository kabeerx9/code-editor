import EntryForm from "@/components/EntryForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import toast from "react-hot-toast";

const Home = () => {
	const [defaultValues, setDefaultValues] = useState({
		roomId: "",
		username: "",
	});

	const createNewRoom = () => {
		const id = uuidv4();
		setDefaultValues({ ...defaultValues, roomId: id });
		toast.success("Created new room");
	};

	return (
		<div className="h-full w-full flex justify-center items-center">
			<Card className="w-full md:w-1/2  ">
				<CardHeader>
					<CardTitle className="text-4xl">Fatafat baat</CardTitle>
					<CardDescription>
						Simple React App for Realtime communication{" "}
					</CardDescription>
					<CardContent className="m-0 p-0">
						<EntryForm defaultValues={defaultValues} />
					</CardContent>
					<CardFooter className="m-0 p-0 flex ">
						<p className="text-muted-foreground font-semibold">
							If you don't have an invite then create{" "}
							<span
								className="text-green-500 font-semibold cursor-pointer underline ml-2 hover:opacity-50 "
								onClick={createNewRoom}
							>
								new room
							</span>{" "}
						</p>
					</CardFooter>
				</CardHeader>
			</Card>
		</div>
	);
};

export default Home;
