import createClient from "@/supabase/clients/server";
import { CapsuleWidgetView } from "./CapsuleWidgetView";
import { getFormatter } from "next-intl/server";
import { TLEditorSnapshot } from "tldraw";
import { Json } from "@/supabase/types/database.types";
import logger from "@/app/_utils/logger";
import { getUser } from "@/app/(backend)/api/auth/auth.server";

export async function CapsuleWidget ({ capsuleTitle, capsuleId, roomId }: { capsuleTitle: string, capsuleId: null | string, roomId: string }) {
	const supabase = await createClient();
	const formatter = await getFormatter();
	let capsuleDate = "";
	let capsuleSnapshot: Json | TLEditorSnapshot | null = null;

    const userId = (await getUser()).data?.user?.id;
    if (!userId) {
        logger.error('supabase:auth', 'CapsuleWidget', 'No user id');
		throw new Error("L'utilisateur n'a pas été trouvé");
    }

	logger.log('supabase:database', 'CapsuleWidget', 'userId', userId, 'capsuleId', capsuleId);
	if (!capsuleId)
		throw new Error("capsuleId n'existe pas");
	const { data: capsuleData } = await supabase.from('capsules').select('created_at').eq("created_by", userId).eq('id', capsuleId).single();
	if (capsuleData)
	{
		const date = new Date(capsuleData.created_at);
		capsuleDate = formatter.dateTime(date, { dateStyle: 'short' });
	}
	const { data: capsuleRoomData } = await supabase.from('rooms').select('capsule_snapshot').eq("created_by", userId).eq("capsule_id", capsuleId).eq('id', parseInt(roomId)).single();
	if (capsuleRoomData)
	{
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