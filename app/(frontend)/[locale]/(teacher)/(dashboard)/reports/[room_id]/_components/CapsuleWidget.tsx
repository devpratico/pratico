import createClient from "@/supabase/clients/server";
import { CapsuleWidgetView } from "./CapsuleWidgetView";
import { getFormatter } from "next-intl/server";
import { TLEditorSnapshot } from "tldraw";
import { fetchRoomsByCapsuleId } from "@/app/(backend)/api/room/room.server";
import { Json } from "@/supabase/types/database.types";
import logger from "@/app/_utils/logger";

export async function CapsuleWidget ({ userId, capsuleTitle, capsuleId }: { userId: string, capsuleTitle: string, capsuleId: null | string }) {
	const supabase = createClient();
	const formatter = await getFormatter();
	let capsuleDate = "";
	let capsuleSnapshot: Json | TLEditorSnapshot | null = null;
	let isRoom = false;
	if (!capsuleId)
		throw new Error("capsuleId is missing");
	const { data: capsuleData } = await supabase.from('capsules').select('tld_snapshot, created_at').eq("created_by", userId).eq('id', capsuleId).single();
	if (capsuleData)
	{
		const date = new Date(capsuleData.created_at);
		capsuleDate = formatter.dateTime(date, { dateStyle: 'short' });
		if (capsuleData.tld_snapshot && capsuleData.tld_snapshot?.length > 0)
			capsuleSnapshot = capsuleData.tld_snapshot[0];
		const { data: roomData } = await fetchRoomsByCapsuleId(capsuleId);
		if (roomData)
		{
			if (roomData.length > 0)
				isRoom = roomData[0].status === "open";
		}
		else
			logger.error('supabase:database', 'CapsuleWidget', 'Error getting room data');
	}
	const data = {
		capsuleId: capsuleId,
		capsuleTitle: capsuleTitle,
		capsuleDate: capsuleDate,
		capsuleSnapshot: capsuleSnapshot,
		isRoom: isRoom,
	};
	return (<>
		<CapsuleWidgetView data={data} />
	</>)
};