"use client";
import { Flex, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";


export interface WidgetContentProps {
	data: {
		type: string, // "attendance" | "capsule" | "activity"
		title?: string,
		info?: string, // "Date: " | "Créer le" | "n questions" 
		date?: {
			date: string,
			end: string | null | undefined
		}
	}
};

export function WidgetContent ({ data }: WidgetContentProps) {
	const formatter = useFormatter();
	const [ date, setDate ] = useState<{start?: {date: string, time: string}, end?: {date: string, time: string}}>({});
	const [ info, setInfo ] = useState<string>("");

	useEffect(() => {
		if (data?.date) {
			const newDate = {} as {
				start?: { date: string; time: string };
				end?: { date: string; time: string };
			};
		
			if (data.date.date) {
				const startDate = new Date(data.date.date);
				newDate.start = {
					date: formatter.dateTime(startDate, {
						day: "numeric",
						month: "numeric",
						year: "numeric",
					}),
					time: `Début: ${formatter.dateTime(startDate, {
						hour: "numeric",
						minute: "numeric",
						second: "numeric",
					})}`
				};
			}
			
			if (data.date.end) {
				const endDate = new Date(data.date.end);
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
					})
				};
			}
			if (newDate.start?.date && newDate.start.date === newDate.end?.date) {
				newDate.end.date = "Fin: ";
			} else if (newDate.end?.date) {
				newDate.end.date = "Fin: " + newDate.end?.date;
			}
			if (data.type === "attendance")
				setInfo(`Date: ${newDate.start?.date}`);
			else if (data.type === "capsule")
				setInfo(`Créer le ${newDate.start?.date}`);
			setDate((prev) => (prev) !== (newDate) ? newDate : prev);
		}
	}, [data?.date, formatter, data?.type]);

	return (
		<Flex direction="column" gap="1">
			<Text weight="bold">
			{
				data.title
				? data.title
				: ""
			}
			</Text>
			<Text>
				{info}
			</Text>
			<Text>
				{date.start?.time}
			</Text>
			<Text>
				{date.end?.date} {date.end?.time}
			</Text>	
		</Flex>
	);
};