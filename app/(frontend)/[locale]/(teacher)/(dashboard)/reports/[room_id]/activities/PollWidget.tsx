"use client";

import { Box, Button, DataList, Grid, Heading } from "@radix-ui/themes";
import { WidgetThumb } from "../_components/WidgetThumb";
import ReportWidgetTemplate from "../_components/ReportWidgetTemplate";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";

export default function PollWidget () {

	const Thumb = () => <WidgetThumb bigText={"100%"} smallText={"de participation"} />;
	
	const Content = () => {
		return (
			<Box>
				<Heading as='h2' size='4' mb='4'>Sondage: Titre du sondage</Heading>
				<DataList.Root size='1'>
					<DataList.Item>
						<DataList.Label>Nb de questions</DataList.Label>
						<DataList.Value>3</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>Début</DataList.Label>
						<DataList.Value>30/12/2008 13:07:17</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>Fin</DataList.Label>
						<DataList.Value>04/01/2001 17:11:01</DataList.Value>
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