import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const formSchema = z.object({
	roomId: z.string().min(2, {
		message: "Room ID must be at least 2 characters.",
	}),
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
});

export default function EntryForm({
	defaultValues,
}: {
	defaultValues: {
		roomId: string;
		username: string;
	};
}) {
	const navigate = useNavigate();

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			roomId: "",
			username: "",
		},
	});

	useEffect(() => {
		const onKeydown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				form.handleSubmit(onSubmit)();
			}
		};
		window.addEventListener("keydown", onKeydown);
		return () => {
			window.removeEventListener("keydown", onKeydown);
		};
	}, []);

	useEffect(() => {
		form.reset(defaultValues);
	}, [defaultValues.roomId, defaultValues.username]);

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		navigate(`/editor/${values.roomId}`, {
			state: {
				username: values.username,
			},
		});
		toast.success("Joined the room");
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-10 ">
				<FormField
					control={form.control}
					name="roomId"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="ROOM ID" {...field} />
							</FormControl>
							<FormDescription>
								Enter the Room ID you have been invited to.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="USERNAME" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button variant="outline" className="bg-green-400 " type="submit">
					JOIN
				</Button>
			</form>
		</Form>
	);
}
