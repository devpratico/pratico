import { Grid, Flex } from "@radix-ui/themes";

interface ReportWidgetTemplateProps {
    thumb: React.ReactNode;
    content: React.ReactNode;
    buttons: React.ReactElement;
}



export default function ReportWidgetTemplate({ thumb, content, buttons }: ReportWidgetTemplateProps) {
    return (
        <Grid align="center" columns='auto 1fr' rows='1' p='5' gap='5' style={{boxShadow:'var(--shadow-2)', borderRadius:'var(--radius-4)', backgroundColor:'var(--accent-1)'}}>
			{thumb}
			<Grid columns='1' rows='1fr auto' gap='5' height="100%">
				{content}
				<Flex gap="2" align="center" justify='end'>
					{buttons}
				</Flex>
			</Grid>
        </Grid>
    )
}