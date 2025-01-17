import { useUser } from '@/app/(frontend)/_hooks/contexts/useUser';
import createClient from '@/supabase/clients/client';
import { useEffect, useState } from 'react';
import { DefaultToolbar, ToolbarItem, useTools } from 'tldraw';

export function CustomTlToolbar() {
	const tools = useTools();
	const { user } = useUser();
	const myTmpTools: string[] = Object.keys(tools).filter((toolKey) => !["hand", "frame"].includes(toolKey));
	const [ myTools, setMyTools ] = useState<string[]>(myTmpTools);

	useEffect(() => {
		const isStudentView = async () => {
			if (!user) return;
			const supabase = createClient();
			const favorites = ["select", "eraser", "draw", "text", "note", "asset"];
			const { count, error } = await supabase.from("rooms").select("id", {head: true, count: "exact"})
				.eq("created_by", user.id)
				.eq("status", "open");
			if (!count || error)
				setMyTools((prev) => prev.filter((toolKey) => !["select", "laser"].includes(toolKey)));
	
			setMyTools((prev) => prev.sort((toolKeyA, toolKeyB) => {
				const indexA = favorites.indexOf(toolKeyA);
				const indexB = favorites.indexOf(toolKeyB);
		
				if (indexA === -1 && indexB === -1) return (0);
				if (indexA === -1) return (1);
				if (indexB === -1) return (-1);
		
				return (indexA - indexB);
			}));
		}
		isStudentView();
		
	}, [user]);

	
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
