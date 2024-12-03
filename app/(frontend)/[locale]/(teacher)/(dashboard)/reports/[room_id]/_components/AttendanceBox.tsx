"use client";
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation";
import { Json } from "@/supabase/types/database.types";
import { Badge, Box, Button, Flex, Grid, Skeleton, Strong, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";

export type AttendanceBoxProps = {
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
export function AttendanceBox ({data}: AttendanceBoxProps) {
	const formatter = useFormatter();
	const [ date, setDate ] = useState<{start?: {date: string, time: string}, end?: {date: string, time: string}}>({});
	const [ loading, setLoading ] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (data?.sessionDate) {
			const newDate = {} as {
				start?: { date: string; time: string };
				end?: { date: string; time: string };
			};
		
			if (data.sessionDate.date) {
				const startDate = new Date(data.sessionDate.date);
				newDate.start = {
					date: formatter.dateTime(startDate, {
					day: "numeric",
					month: "numeric",
					year: "numeric",
					}),
					time: formatter.dateTime(startDate, {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					}),
				};
			}
			
			if (data.sessionDate.end) {
				const endDate = new Date(data.sessionDate.end);
				newDate.end = {
					date:  formatter.dateTime(endDate, {
					day: "numeric",
					month: "numeric",
					year: "numeric",
					}),
					time: formatter.dateTime(endDate, {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					}),
				};
			}
			if (newDate.start?.date && newDate.start.date === newDate.end?.date) {
				newDate.end.date = "";
			}
			setDate((prev) => (prev) !== (newDate) ? newDate : prev);
		}
	}, [data?.sessionDate, formatter]);

	useEffect(() => {
		setLoading(false);
	}, [date]);

	return (
		<Box style={{ position: "relative", borderRadius: "10px", border: "1px solid"}}>
			<Flex my="5">
				<Grid columns="2" justify="between" align="center">
					<Box>
						<Flex direction="column" gap="3" align="center">
							<Text style={{ color: "var(--violet-10)" }} size="9">{data?.attendanceCount}</Text>
							<Text style={{ color: "var(--violet-10)" }}>
							{
								data?.attendanceCount && data?.attendanceCount > 1
								? ` PARTICIPANTS`
								: ` PARTICIPANT`
							}
							</Text>
						</Flex>
					</Box>

					<Box>
						<Flex direction="column" gap="1">
							<Text weight="bold">
								{
									data?.userInfo?.first_name && data?.userInfo?.last_name
									? `Animateur: ${data?.userInfo?.first_name} ${data?.userInfo?.last_name}`
									: <></>
								}
							</Text>
							<Text>
								Date: { !loading ? `${date?.start?.date}` : <Skeleton /> }
							</Text>
							<Text>
								Début: { !loading ? `${date?.start?.time}` : <Skeleton /> }
							</Text>
							<Text>
								Fin: { !loading ? `${date?.end?.date} ${date?.end?.time}` : <Skeleton />}
							</Text>
						</Flex>
					</Box>
				</Grid>
				<Button onClick={() => data?.nextUrl && router.push(data?.nextUrl)} asChild>
					<Badge size="1" style={{ backgroundColor: "var(--violet-5)", cursor: "pointer", position: "absolute", bottom: "20px", right: "20px", borderRadius: "50px"}}>
						<Strong>Détails</Strong>
					</Badge>
				</Button>
			</Flex>
		</Box>
	);
};