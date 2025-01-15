import { DefaultStylePanel, DefaultStylePanelContent, TLUiStylePanelProps, useRelevantStyles } from "tldraw"


export function CustomTlStylePanel(props: TLUiStylePanelProps) {
	const styles = useRelevantStyles();

	return (
		<DefaultStylePanel {...props} >
			<style>
			{`
				.tlui-popover__content {
					margin-left: 4.5rem !important;
				}
			`}
			</style>
			<DefaultStylePanelContent styles={styles} />
		</DefaultStylePanel>
	)
}