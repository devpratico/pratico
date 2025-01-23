"use client";

import { Box, Button, DataList, Grid, Heading } from "@radix-ui/themes";
import { WidgetThumb } from "../../_components/WidgetThumb";
import ReportWidgetTemplate from "../../_components/ReportWidgetTemplate";
import { Link } from "@/app/(frontend)/_intl/intlNavigation";

export default function QuizWidget () {

	const Thumb = () => <WidgetThumb bigText={"20%"} smallText={"de réussite"} color="red" />;
	
	const Content = () => {
		return (	<Box>
			<Heading as='h2' size='2'mb="2" color="gray">Quiz</Heading>
			<Heading as='h3' size='4' mb='4'>Titre du quiz</Heading>
			<DataList.Root size='1'>
				<DataList.Item>
					<DataList.Label>Questions</DataList.Label>
					<DataList.Value>3678</DataList.Value>
				</DataList.Item>

				<DataList.Item>
					<DataList.Label>Début</DataList.Label>
					<DataList.Value>13:07:17</DataList.Value>
				</DataList.Item>

				<DataList.Item>
					<DataList.Label>Fin</DataList.Label>
					<DataList.Value>05:10:26</DataList.Value>
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
