import { DefaultStylePanel, DefaultStylePanelContent, TLUiStylePanelProps, useRelevantStyles } from "tldraw"


export function CustomTlStylePanel(props: TLUiStylePanelProps) {
	const styles = useRelevantStyles();

	return (
		<DefaultStylePanel {...props}>
			<DefaultStylePanelContent styles={styles} />
		</DefaultStylePanel>
	)
}