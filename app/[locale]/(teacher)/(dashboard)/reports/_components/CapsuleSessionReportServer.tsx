import logger from "@/app/_utils/logger";
import { fetchAttendancesByRoomId } from "@/app/api/_actions/attendance";
import { fetchRoomsByCapsuleId } from "@/app/api/_actions/room";
import { SetStateAction, useState } from "react";
import { SessionInfoType } from "../[capsule_id]/page";

export default async function CapsuleSessionsReportServer({capsuleId, setSessionInfo}: {capsuleId: string, setSessionInfo: React.Dispatch<SetStateAction<SessionInfoType[] | null>>}) {
	let sessions: SessionInfoType[] = [];
	const { data: roomData, error: roomError } = await fetchRoomsByCapsuleId(capsuleId);
	logger.debug("supabase:database", "CapsuleSessionsReportServer", "fetchRoomsByCapsuleId datas", roomData, roomError);
	if (!roomData || roomError)
	{
		logger.error("supabase:database", "CapsuleSessionsReportServer", roomError ? roomError : "No rooms data for this capsule");
		return ("error");
	}
	roomData.map(async (room) => {
		const{ data, error } =  await fetchAttendancesByRoomId(room.id);
		if (!data || error)
			logger.error("supabase:database", "CapsuleSessionsReportServer", error ? error : "No attendance data for this room");
		const infos: SessionInfoType = {
			created_at: room.created_at,
			numberOfParticipant: data ? data.length : 0,
			status: room.status
		}
		sessions.push(infos);
	});
	setSessionInfo(sessions);
	return (<>
	</>);
};