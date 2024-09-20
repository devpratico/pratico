import Thumbnail from "@/app/[locale]/_components/Thumbnail";
import logger from "@/app/_utils/logger";
import { Box, Callout, Card, Heading, Inset, Separator, Text } from "@radix-ui/themes";
import { TLEditorSnapshot } from "tldraw";
import { CapsuleType } from "../page";
import { fetchAttendance } from "@/app/api/_actions/attendance";
import { fetchRoomsByCapsuleId, fetchRoomsbyUser } from "@/app/api/_actions/room";
import { Database, Json } from "@/supabase/types/database.types";

// TYPE
export type RoomType = {
	activity_snapshot: Json | null;
    capsule_id: string | null;
    capsule_snapshot: Json | null;
    code: string | null;
    created_at: string;
    created_by: string | null;
    id: number;
    params: Json | null;
    status: Database["public"]["Enums"]["RoomStatus"];
}
export default async function CapsuleReports ({ capsule, userId }:{ capsule: CapsuleType, userId: string }) {

	const capsuleId = capsule.id;
	const title = capsule.title;
	const created_at = new Date(capsule.created_at); //---> if we want to use it someday
	const snap = capsule.tld_snapshot?.[0] as TLEditorSnapshot | undefined;
	let lastSession: RoomType | null = null;
	// logger.debug("react:component", "CapsuleReports capsule:", capsule);
	const { data: roomData, error: roomError } = await fetchRoomsByCapsuleId(capsuleId);
	logger.log("supabase:database", "CapsuleReports component", "fetchRoomsByCapsuleId");
	if (roomData?.length)
	{
		lastSession = roomData.reduce((mostRecent, current) => {
			// logger.debug("supabase:database", "test chronologique", mostRecent, current);
			return (new Date(current.created_at) > new Date(mostRecent.created_at) ? current : mostRecent);
		});
	}

	const formatDate = (date: string | undefined) => {
		if (!date)
			return ;
		return (new Date(date).toLocaleString('fr-FR'));
	  }
	return (
		<>
			<Card size="2">
				<Inset clip="padding-box" side="top" pb="current">
					<Thumbnail snapshot={snap} scale={0.07}/>
				</Inset>
				<Heading>{title === 'Sans titre' ? 'Capsule sans titre' : title}</Heading>
				<Separator size='4' my='4' />
				<Callout.Text size="3">
					Nombre de sessions: {roomData?.length ? roomData.length : 'Aucune'}
					<Separator />
					{ roomData?.length ? `Derniere session: ${formatDate(lastSession?.created_at)}` : null }
					
				</Callout.Text>
			</Card>
		</>
	);

};