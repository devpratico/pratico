"use client";

import createClient from "@/supabase/clients/client";
import { useEffect } from "react";

export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	const supabase = createClient();

	useEffect(() => {
		const getData = async () => {
			console.log("Playground getData");
			const { data: { user } } = await supabase.auth.getUser();
		
			if (!user)
				return (console.log("USER NOT FOUND IN THE PLAYGROUND"));
			const { data, error } = await supabase.from("rooms").select("*").eq("created_by", user.id).limit(1);
			if (data)
				console.log("HERE THE DATA:", data);
			else
			{
				if (error)
					console.error("HERE THE ERROR:", error);
				else
					console.log("NOTHING, NO DATA NOR ERROR");
			}
		};
		getData();
	}, []);


	return (
		<></>
	)
};

