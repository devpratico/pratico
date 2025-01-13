import { DefaultStylePanel, DefaultStylePanelContent, TLUiStylePanelProps, useRelevantStyles } from "tldraw"

export function CustomTlStylePanel(props: TLUiStylePanelProps) {
	const styles = useRelevantStyles()

	return (
		<DefaultStylePanel  >
				{/* <DefaultStylePanelContent styles={{}} /> */}
		</DefaultStylePanel>
	)
}