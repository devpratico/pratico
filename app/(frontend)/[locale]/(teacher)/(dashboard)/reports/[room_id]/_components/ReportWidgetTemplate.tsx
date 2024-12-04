import { Grid, Flex } from "@radix-ui/themes";

interface ReportWidgetTemplateProps {
    thumb: React.ReactNode;
    content: React.ReactNode;
    buttons: React.ReactElement;
}



export default function ReportWidgetTemplate({ thumb, content, buttons }: ReportWidgetTemplateProps) {
    return (
        <Grid columns='auto 1fr' rows='1' p='3' gap='3'  style={{boxShadow:'var(--shadow-2)', borderRadius:'var(--radius-3)', backgroundColor:'var(--accent-1)'}}>
            {thumb}

            <Grid columns='1' rows='1fr auto' gap='3'>
                {content}

                <Flex gap='3' justify='end'>
                    {buttons}
                </Flex>
            </Grid>
        </Grid>
    )
}