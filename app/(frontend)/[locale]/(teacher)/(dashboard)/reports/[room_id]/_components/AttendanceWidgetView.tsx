"use client";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Json } from "@/supabase/types/database.types";
import { Badge, Box, Button, Flex, Grid, Skeleton, Strong, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { WidgetThumb } from "./WidgetThumb";
import { WidgetContent } from "./WidgetContent";
import { WidgetButtons } from "./WidgetButtons";
import ReportWidgetTemplate from "./ReportWidgetTemplate";

export type AttendanceWidgetViewProps = {
	data: {
		sessionDate: {
			date: string,
			end: string | null | undefined
		},
		userInfo: {
			first_name: string | null,
			last_name: string | null,
			organization: Json | null
		} | null,
		attendanceCount: number;
		nextUrl: string;
	} | null;
};

export function AttendanceWidgetView ({data}: AttendanceWidgetViewProps) {
	const formatter = useFormatter();
	const [ date, setDate ] = useState<{start?: {date: string, time: string}, end?: {date: string, time: string}}>({});
	const [ loading, setLoading ] = useState(true);

	// useEffect(() => {
	// 	if (data?.sessionDate) {
	// 		const newDate = {} as {
	// 			start?: { date: string; time: string };
	// 			end?: { date: string; time: string };
	// 		};
		
	// 		if (data.sessionDate.date) {
	// 			const startDate = new Date(data.sessionDate.date);
	// 			newDate.start = {
	// 				date: formatter.dateTime(startDate, {
	// 				day: "numeric",
	// 				month: "numeric",
	// 				year: "numeric",
	// 				}),
	// 				time: formatter.dateTime(startDate, {
	// 				hour: "numeric",
	// 				minute: "numeric",
	// 				second: "numeric",
	// 				}),
	// 			};
	// 		}
			
	// 		if (data.sessionDate.end) {
	// 			const endDate = new Date(data.sessionDate.end);
	// 			newDate.end = {
	// 				date:  formatter.dateTime(endDate, {
	// 				day: "numeric",
	// 				month: "numeric",
	// 				year: "numeric",
	// 				}),
	// 				time: formatter.dateTime(endDate, {
	// 				hour: "numeric",
	// 				minute: "numeric",
	// 				second: "numeric",
	// 				}),
	// 			};
	// 		}
	// 		if (newDate.start?.date && newDate.start.date === newDate.end?.date) {
	// 			newDate.end.date = "";
	// 		}
	// 		setDate((prev) => (prev) !== (newDate) ? newDate : prev);
	// 	}
	// }, [data?.sessionDate, formatter]);

	// useEffect(() => {
	// 	setLoading(false);
	// }, [date]);
	
	const thumbData = {
		type: "attendance",
		count: data?.attendanceCount,
		message: data?.attendanceCount && data?.attendanceCount > 1 ? "PARTICIPANTS" : "PARTICIPANT",
		color: "var(--violet-10)"
	}
	const contentData = {
		type: "attendance",
		title: data?.userInfo?.first_name && data?.userInfo?.last_name ? `Animateur: ${data?.userInfo?.first_name} ${data?.userInfo?.last_name}`: "",
		info: "Date: ",
		date: data?.sessionDate,
	}

	const AttendanceThumb = <WidgetThumb data={thumbData}/>;
	const AttendanceContent = <WidgetContent data={contentData}/>;
	const AttendanceButtons = <WidgetButtons />;

	return (
		<ReportWidgetTemplate thumb={AttendanceThumb} content={AttendanceContent} buttons={AttendanceButtons} />
		// <Box style={{ position: "relative", borderRadius: "10px", border: "1px solid"}}>
		// 	<Grid my="5" columns="2" justify="between" align="center">
		// 		<Box>
		// 			<Flex direction="column"  align="center">
		// 				<Text style={{ color: "var(--violet-10)" }} size="9">{data?.attendanceCount}</Text>
		// 				<Text style={{ color: "var(--violet-10)" }}>
		// 				{
		// 					data?.attendanceCount && data?.attendanceCount > 1
		// 					? ` PARTICIPANTS`
		// 					: ` PARTICIPANT`
		// 				}
		// 				</Text>
		// 			</Flex>
		// 		</Box>

		// 		<Box>
		// 			<Flex direction="column" gap="1">
		// 				<Text weight="bold">
		// 					{
		// 						data?.userInfo?.first_name && data?.userInfo?.last_name
		// 						? `Animateur: ${data?.userInfo?.first_name} ${data?.userInfo?.last_name}`
		// 						: <></>
		// 					}
		// 				</Text>
		// 				<Text>
		// 					Date: { !loading ? `${date?.start?.date}` : <Skeleton /> }
		// 				</Text>
		// 				<Text>
		// 					Début: { !loading ? `${date?.start?.time}` : <Skeleton /> }
		// 				</Text>
		// 				<Flex gap="1" justify="between">
		// 					<Text>
		// 						Fin: { !loading ? `${date?.end?.date} ${date?.end?.time}` : <Skeleton /> }
		// 					</Text>	
		// 					<Button mr="2" onClick={() => data?.nextUrl && router.push(data?.nextUrl)} asChild>
		// 						<Badge size="1" style={{ backgroundColor: "var(--violet-5)", cursor: "pointer", borderRadius: "50px"}}>
		// 							<Strong>Détails</Strong>
		// 						</Badge>
		// 					</Button>
		// 				</Flex>
						
		// 			</Flex>
		// 		</Box>
		// 	</Grid>
		// </Box>
	);
};