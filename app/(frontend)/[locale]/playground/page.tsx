"use client";

import { Box, Button, DataList, Grid, Heading } from "@radix-ui/themes";
import ReportWidgetTemplate from "../(teacher)/(dashboard)/reports/[room_id]/_components/ReportWidgetTemplate";
import { WidgetThumb } from "../(teacher)/(dashboard)/reports/[room_id]/_components/WidgetThumb";
import { Link } from "../../_intl/intlNavigation";

export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	const Thumb = () => <WidgetThumb bigText={"100%"} smallText={"de participation"} color="green" />;
	
	const Content = () => {
		return (	<Box>
			<Heading as='h2' size='4' mb='4'>Sondage: Titre du sondage</Heading>
			<DataList.Root size='1'>
				<DataList.Item>
					<DataList.Label>Nb de questions</DataList.Label>
					<DataList.Value>3</DataList.Value>
				</DataList.Item>

				<DataList.Item>
					<DataList.Label>Début</DataList.Label>
					<DataList.Value>13/02/1956 13:07:17</DataList.Value>
				</DataList.Item>

				<DataList.Item>
					<DataList.Label>Fin</DataList.Label>
					<DataList.Value>11/01/2025 05:10:26</DataList.Value>
				</DataList.Item>
			</DataList.Root>
		</Box>);
	};
	const buttons = <Button radius="full" asChild>
	<Link href={"#"}>
		Détails
	</Link>
</Button>;

	return (
		<Grid columns='repeat(auto-fill, minmax(400px, 1fr))' gap='3' mt='8'>

		<ReportWidgetTemplate 
			thumb={<Thumb />}
			content={<Content />}
			buttons={buttons}
		/>
		</Grid>
	)
};

