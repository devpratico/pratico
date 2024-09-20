
"use client";
import { useRouter } from "next/navigation";
import useSearchParams from "@/app/_hooks/useSearchParams";
import CapsuleSessionsReportServer from "../_components/CapsuleSessionReportServer";
import logger from "@/app/_utils/logger";
import { useState } from "react";


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
	const [ sessionInfo, setSessionInfo ] = useState<SessionInfoType[] | null>(null);
	if (!capsuleId)
	{
		logger.error("next:page", "ReportsOfCapsulePage", "capsuleId missing");
		router.push("/reports");
		return ;
	}
	logger.log("next:page", "Reports of capule #", capsuleId);
	return (
		<>
			{/* {
				sessionInfo
				? sessionInfo.map((session) => {
					return (<>{session.created_at} - {session.numberOfParticipant} - {session.status}</>)
				})
				: <CapsuleSessionsReportServer capsuleId={capsuleId} setSessionInfo={setSessionInfo} />
			} */}
		</>
	);
};