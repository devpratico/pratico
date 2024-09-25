import Thumbnail from "@/app/[locale]/_components/Thumbnail";
import logger from "@/app/_utils/logger";
import { Card, DataList, Heading, Inset, Link, Separator } from "@radix-ui/themes";
import { TLEditorSnapshot } from "tldraw";
import { CapsuleType } from "../page";
import { fetchRoomsByCapsuleId } from "@/app/api/actions/room";
import { Database, Json } from "@/supabase/types/database.types";
import { formatDate } from "@/app/_utils/utils_functions";
import { Loading } from "./LoadingPage";

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

export default async function CapsuleReports ({ capsule }:{ capsule: CapsuleType }) {
	const capsuleId = capsule.id;
	const title = capsule.title;
	const url = `/reports/${capsuleId}`;
	let lastSession: string | undefined = "";
	let nbOfSession = 0;
	let loading = true;
	// const created_at = new Date(capsule.created_at); //---> if we want to use it someday
	const snap = capsule.tld_snapshot?.[0] as TLEditorSnapshot | undefined;

	try {
		const { data, error } = await fetchRoomsByCapsuleId(capsuleId);
		logger.log("supabase:database", "CapsuleReports component", "fetchRoomsByCapsuleId");
		if (data?.length)
		{
			const tmp = data.reduce((mostRecent, current) => {
				return (new Date(current.created_at) > new Date(mostRecent.created_at) ? current : mostRecent);
			});
			lastSession = formatDate(tmp.created_at);
			nbOfSession = data.length
		}
	} catch (error) {
		logger.error("react:component", "CapsuleReports", "Error caugh", error);
	} finally {
		loading = false;
	}


	return (
		<>
			<Card>
				{
					loading
					? <Loading />
					:	<Link href={url} style={{ all: 'unset', cursor: 'pointer'}}>
							<Inset clip="padding-box" side="top" pb="current">
								{
									snap 
									? <Thumbnail snapshot={snap} scale={0.07}/>
									:   <div
											style={{
												position: 'relative',
												width: '100%',
												height: '100%',
												minHeight: '107px',
												backgroundColor: 'white',
												borderRadius: 'var(--radix-border-radius-md)',
												overflow: 'hidden'
											}}
										/>
								}
							</Inset>
							<Heading>{title === 'Sans titre' ? 'Capsule sans titre' : title}</Heading>
							<Separator size='4' my='4' />
							<DataList.Root orientation={"vertical"}>
								<DataList.Item>
									<DataList.Label minWidth="88px">Nombre de sessions</DataList.Label>
									<DataList.Value>
										{nbOfSession ? nbOfSession : "Aucune"}
									</DataList.Value>
								</DataList.Item>
								<DataList.Item>
									<DataList.Label minWidth="88px">Dernière session</DataList.Label>
									<DataList.Value>{lastSession ? lastSession : "Jamais"}</DataList.Value>
								</DataList.Item>
							</DataList.Root>
						</Link>
				}
					
			</Card>
		
		</>
	);

};