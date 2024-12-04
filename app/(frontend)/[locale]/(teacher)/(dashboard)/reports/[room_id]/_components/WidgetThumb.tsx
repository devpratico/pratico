import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import { Flex, Text } from "@radix-ui/themes";

export interface WidgetThumbProps {
	data: {
		type: string; // "attendance" | "capsule" | "activity"
		count?: number;
		message?: string; // "Taux de reussite" | "Taux de participation" (quiz/sondage) | "PARTICIPANT(S)" (attendance)
		thumbnail?: any; // the capsule thumbnail
		color: string;
	}
};

export function WidgetThumb({ data }: WidgetThumbProps) {
	let ret = <></>;
	const style = {
		color: data.color
	}

	switch (data.type) {
		case "capsule":
			ret = <>{Thumbnail}</>
			break ;
		case "attendance":
		case "activity":
			ret = <>
				<Text style={style} size="9">{data?.count}</Text>
				<Text style={style}>
					{data.message}
				</Text>
			</>
			break ;

	}
	return (
		<Flex direction="column"  align="center">
			{ret}
		</Flex>
	)
}