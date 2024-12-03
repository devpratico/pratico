"use client";
import { Json } from "@/supabase/types/database.types";
import { Box } from "@radix-ui/themes";

export type AttendanceBoxProps = {
	data: {
		roomId: number,
		sessionDate: {
			date: string,
			end: string | null | undefined
		},
		userInfo: {
			first_name: string | null,
			last_name: string | null,
			organization: Json | null
		} | null,
		attendanceCount: number
	} | null;
};
export function AttendanceBox ({data}: AttendanceBoxProps) {

	return (<Box onClick={() => console.log("Clicked on attendance box")} style={{backgroundColor: "var(--violet-8)"}}>
		TEST ATTENDANCE
	</Box>);
};