
"use client";
import { useRouter } from "next/navigation";
import useSearchParams from "@/app/_hooks/useSearchParams";
import logger from "@/app/_utils/logger";
import { useEffect, useState } from "react";
import { fetchRoomsByCapsuleId } from "@/app/api/_actions/room";
import { fetchAttendanceByRoomId } from "@/app/api/_actions/attendance";


// TYPE
export type SessionInfoType = {
	created_at: string,
	numberOfParticipant: number,
	status?: "open" | "closed"
};


export default  function CapsuleSessionReportPage () {
	const searchParams = useSearchParams().getPathnameWithoutSearchParam("capsuleId");
	const router = useRouter();
	const capsuleId = searchParams.split("/").pop();
	const [ sessionInfo, setSessionInfo ] = useState<SessionInfoType[] | null>([]);
	if (!capsuleId)
	{
		logger.error("next:page", "ReportsOfCapsulePage", "capsuleId missing");
		router.push("/reports");
		return ;
	}
	useEffect(() => {
		const getSessions = async () => {
			try {
				let sessions: SessionInfoType[] = [];
				const { data: roomData, error: roomError } = await fetchRoomsByCapsuleId(capsuleId);
				logger.debug("supabase:database", "CapsuleSessionsReportServer", "fetchRoomsByCapsuleId datas", roomData, roomError);
				if (!roomData || roomError)
				{
					logger.error("supabase:database", "CapsuleSessionsReportServer", roomError ? roomError : "No rooms data for this capsule");
					return ("error");
				}
				await Promise.all(roomData.map(async (room) => {
					const{ data, error } =  await fetchAttendanceByRoomId(room.id);
					if (!data || error)
						logger.error("supabase:database", "CapsuleSessionsReportServer", error ? error : "No attendance data for this room");
					const infos: SessionInfoType = {
						created_at: room.created_at,
						numberOfParticipant: data ? data.length : 0,
						status: room.status
					}
					sessions.push(infos);
				}));
				setSessionInfo(sessions);
				console.log(sessions);
			} catch (err) {
				console.error("Error getting sessions", err);
			}
		}

		getSessions();
	}, []);
	logger.log("next:page", "Reports of capule #", capsuleId);
	return (
		<>
			{
				sessionInfo && sessionInfo.length
				?	sessionInfo.map((session, index) => {
						return (<div key={index}>{session.created_at} - {session.numberOfParticipant} - {session.status}</div>);
					})
				: "Aucune sessions pour cette capsule"
			}
		</>
	);
};