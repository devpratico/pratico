import { useUser } from '@/app/(frontend)/_hooks/contexts/useUser';
import createClient from '@/supabase/clients/client';
import { useEffect, useState } from 'react';
import { DefaultToolbar, ToolbarItem, useTools } from 'tldraw';

export function CustomTlToolbar() {
	const tools = useTools();
	const { user } = useUser();
	const myTmpTools = Object.keys(tools).filter((toolKey) => !["hand", "frame"].includes(toolKey));
	const [myTools, setMyTools] = useState<string[]>(myTmpTools);
	const [ studentCheck, setStudentCheck ] = useState<boolean>(false);

	useEffect(() => {
		const isStudentView = async () => {
			if (!user) return;
			const supabase = createClient();
			const favorites = ["select", "eraser", "draw", "text", "note", "asset"];

			const { count, error } = await supabase.from("rooms").select("id", {head: true, count: "exact"})
				.eq("created_by", user.id)
				.eq("status", "open");
			if (!count || error)
			{	const tmp =	myTools.filter((toolKey) => !["select", "laser"].includes(toolKey));
				setMyTools(tmp);
			}
			setStudentCheck(true);
			const sortingTools = myTools.sort((toolKeyA, toolKeyB) => {
				const indexA = favorites.indexOf(toolKeyA);
				const indexB = favorites.indexOf(toolKeyB);
		
				if (indexA === -1 && indexB === -1) return (0);
				if (indexA === -1) return (1);
				if (indexB === -1) return (-1);
		
				return (indexA - indexB);
			});
			setMyTools(sortingTools);
		}
		if (!studentCheck)
			isStudentView();
		
	}, [user, studentCheck, myTools]);

	
	return (
		<DefaultToolbar>
		{
			myTools.map((toolKey) => {
				return <ToolbarItem tool={toolKey} key={toolKey}/>
			})
		}
		</DefaultToolbar>
	);
}
