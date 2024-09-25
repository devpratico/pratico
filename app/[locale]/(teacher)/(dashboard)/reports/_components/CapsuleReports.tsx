"use client";
import Thumbnail from "@/app/[locale]/_components/Thumbnail";
import logger from "@/app/_utils/logger";
import { Card, Heading, Inset, Link, Separator } from "@radix-ui/themes";
import { TLEditorSnapshot } from "tldraw";
import { CapsuleType } from "../page";
import { fetchRoomsByCapsuleId } from "@/app/api/actions/room";
import { Database, Json } from "@/supabase/types/database.types";
import { formatDate } from "@/app/_utils/utils_functions";
import { useEffect, useState } from "react";

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

export default function CapsuleReports ({ capsule }:{ capsule: CapsuleType }) {
	const [ roomData, setRoomData ] = useState<{session: RoomType[], lastSession: string | undefined}>({session: [], lastSession: ""});
	const capsuleId = capsule.id;
	const title = capsule.title;
	const url = `/reports/${capsuleId}`;
	// const created_at = new Date(capsule.created_at); //---> if we want to use it someday
	const snap = capsule.tld_snapshot?.[0] as TLEditorSnapshot | undefined;
	let lastSession: RoomType | null = null;
	// logger.debug("react:component", "CapsuleReports capsule:", capsule);
	useEffect(() => {
		const fetchDatas = async () => {
			try {
				const { data, error } = await fetchRoomsByCapsuleId(capsuleId);
				logger.log("supabase:database", "CapsuleReports component", "fetchRoomsByCapsuleId");
				if (data?.length)
				{
					const lastSession = data.reduce((mostRecent, current) => {
						return (new Date(current.created_at) > new Date(mostRecent.created_at) ? current : mostRecent);
					});
					setRoomData({session: data, lastSession: formatDate(lastSession.created_at)});
				}
			} catch (error) {
				logger.error("react:component", "CapsuleReports", "Error caugh", error);
			}

		}
		fetchDatas();
	}, [capsuleId]);

	return (
		<>
			<Link href={url} style={{ all: 'unset', cursor: 'pointer'}}>
				<Card size="2">
					<Inset clip="padding-box" side="top" pb="current">
						<Thumbnail snapshot={snap} scale={0.07}/>
					</Inset>
					<Heading>{title === 'Sans titre' ? 'Capsule sans titre' : title}</Heading>
					<Separator size='4' my='4' />
					Nombre de sessions: {roomData?.session.length ? roomData.session.length : 'Aucune'}
					<Separator />
					{ roomData?.session.length && roomData.lastSession ? `Dernière session: ${roomData.lastSession}` : null }
				</Card>
			</Link>
		</>
	);

};