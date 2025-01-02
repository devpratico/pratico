import createClient from "@/supabase/clients/server";
import { CapsuleWidgetView } from "./CapsuleWidgetView";
import { getFormatter } from "next-intl/server";
import { TLEditorSnapshot } from "tldraw";
import { Json } from "@/supabase/types/database.types";
import logger from "@/app/_utils/logger";

export async function CapsuleWidget ({ userId, capsuleTitle, capsuleId, roomId }: { userId: string, capsuleTitle: string, capsuleId: null | string, roomId: string }) {
	const supabase = createClient();
	const formatter = await getFormatter();
	let capsuleDate = "";
	let capsuleSnapshot: Json | TLEditorSnapshot | null = null;
	logger.log('supabase:database', 'CapsuleWidget', 'userId', userId, 'capsuleId', capsuleId);
	if (!capsuleId)
		throw new Error("capsuleId is missing");
	const { data: capsuleRoomData } = await supabase.from('rooms').select('capsule_snapshot, created_at').eq("created_by", userId).eq("capsule_id", capsuleId).eq('id', roomId).single();
	if (capsuleRoomData)
	{
		const date = new Date(capsuleRoomData.created_at);
		capsuleDate = formatter.dateTime(date, { dateStyle: 'short' });
		if (capsuleRoomData.capsule_snapshot && capsuleRoomData.capsule_snapshot)
			capsuleSnapshot = capsuleRoomData.capsule_snapshot;
	}
	const data = {
		capsuleId: capsuleId,
		capsuleTitle: capsuleTitle,
		capsuleDate: capsuleDate,
		capsuleSnapshot: capsuleSnapshot,
	};
	return (<>
		<CapsuleWidgetView data={data} />
	</>)
};