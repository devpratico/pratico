"use client";

//// INUTILISE //////
////// Capsules display sort choice //////


import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import logger from "@/app/_utils/logger";
import { Card, DataList, Heading, Inset, Link, Separator } from "@radix-ui/themes";
import { TLEditorSnapshot } from "tldraw";
import { CapsuleType } from "../page";
import { Tables } from "@/supabase/types/database.types";
import { formatDate } from "@/app/_utils/utils_functions";
import { useEffect, useState } from "react";
import createClient from "@/supabase/clients/client";

// TYPE
export type RoomType = Tables<"rooms">;

export default function CapsuleReports ({ capsule }:{ capsule: CapsuleType }) {
	const supabase = createClient();
	const capsuleId = capsule.id;
	const title = capsule.title;
	const url = `/reports/${capsuleId}`;
	const [ sessions, setSessions ] = useState<{nbOfSession: number, lastSession: string | undefined}>({nbOfSession: 0, lastSession: undefined});
	// const created_at = new Date(capsule.created_at); //---> if we want to use it someday
	const snap = capsule.tld_snapshot?.[0] as TLEditorSnapshot | undefined;

	useEffect(() => {
		const getDatas = async () => {
			try {
				if (capsuleId)
				{
					const { data, error } = await supabase.from('rooms').select('*').eq('capsule_id', capsuleId);
					logger.log("supabase:database", "CapsuleReports component", "fetchRoomsByCapsuleId");
					if (data?.length)
					{
						const tmp = data.reduce((mostRecent, current) => {
							return (new Date(current.created_at) > new Date(mostRecent.created_at) ? current : mostRecent);
						});
						setSessions((prev) => ({...prev, nbOfSession: data.length, lastSession: formatDate(tmp.created_at)}));
					}
				}
			
			} catch (error) {
				logger.error("react:component", "CapsuleReports", "Error caugh", error);
			}
		}
		getDatas();
	},[capsuleId, supabase]);
	
	return (
		<Card>
			<Link href={url} style={{ all: 'unset', cursor: 'pointer'}}>
				<Inset clip="padding-box" side="top" pb="current">
					<Thumbnail snapshot={snap} scale={0.07}/>
				</Inset>
				<Heading>{title === 'Sans titre' ? 'Capsule sans titre' : title}</Heading>
				<Separator size='4' my='4' />
				<DataList.Root orientation={"vertical"}>
					<DataList.Item>
						<DataList.Label minWidth="88px">Nombre de sessions</DataList.Label>
						<DataList.Value>
							{sessions.nbOfSession ? sessions.nbOfSession : "Aucune"}
						</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label minWidth="88px">Dernière session</DataList.Label>
						<DataList.Value>{sessions.lastSession ? sessions.lastSession : "Jamais"}</DataList.Value>
					</DataList.Item>
				</DataList.Root>
			</Link>
		</Card>
	);

};