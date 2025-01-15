import styles from './ToolBar.module.css'
import DrawTool from '../DrawTool/DrawTool';
import SelectTool from '../SelectTool/SelectTool';
import EraserTool from '../EraserTool/EraserTool';
import TextTool from '../TextTool/TextTool';
import MediaTool from '../media-tool/MediaTool/MediaTool';
import ShapeTool from '../ShapeTool/ShapeTool';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';
import { DefaultToolbar, TldrawUiMenuItem, useTools } from 'tldraw';
import { Grid, IconButton, Popover } from '@radix-ui/themes';
import { ChevronRight } from 'lucide-react';

interface ToolBarProps {
	className?: string;
	state?: ToolBarState;
	dispatch: (action: string, payload: string) => void;
}

export default function ToolBar({className, state = blankState, dispatch}: ToolBarProps) {


	return (
		<div className={`${styles.container} ${className}`}>
			<SelectTool active={state.activeTool == "select"} dispatch={dispatch}/>
			<DrawTool   active={state.activeTool == "draw"} state={state.drawOptions} dispatch={dispatch}/>
			<TextTool   active={state.activeTool == "text"} state={state.textOptions} dispatch={dispatch}/>
			<ShapeTool  active={state.activeTool == "shape"} state={state.shapeOptions} dispatch={dispatch}/>
			<MediaTool  active={state.activeTool == "media"} dispatch={dispatch}/>
			<EraserTool active={state.activeTool == "eraser"} dispatch={dispatch}/>
		</div>
	)
}


const blankState: ToolBarState = {
	activeTool: "select",
	drawOptions: {
		color: "black",
		size: "m",
		type: "normal",
	},
	textOptions: {
		color: "black",
		font: "draw",
		type: "normal",
	},
	shapeOptions: {
		color: "black",
		shape: "rectangle",
		style: "empty",
	}
}

export function CustomTlToolbar() {
	const tools = useTools();
	const favorites = ["select", "eraser", "draw", "text", "note", "asset"];
	const praticoTools = Object.entries(tools).filter(([toolKey]) => {
		return (!["hand", "frame"].includes(toolKey))
	});
	praticoTools.sort(([toolKeyA], [toolKeyB]) => {
		const indexA = favorites.indexOf(toolKeyA);
		const indexB = favorites.indexOf(toolKeyB);

		if (indexA === -1 && indexB === -1) return (0);
		if (indexA === -1) return (1);
		if (indexB === -1) return (-1);

  		return (indexA - indexB);
	});

	const [mainTools, extraTools] = praticoTools.length > 5
    ? [praticoTools.slice(0, 6), praticoTools.slice(6)]
    : [praticoTools, []];

  return (

    <DefaultToolbar>
		{mainTools.map(([toolKey, tool]) =>  (
			<TldrawUiMenuItem key={toolKey} {...tool} />
		))}

		<style>{`
				.tlui-toolbar__tools {
					flex-direction: column !important;
				}

				.tlui-toolbar__tools__list {
					flex-direction: column !important;
				}

				.tlui-toolbar {
				 	justify-content: flex-start !important;
					margin-left: 0.5rem;
				}

				.tlui-layout {
					display: flex !important;
					flex-direction: column !important;
					justify-content: center !important;
					align-items: start !important;
				}

				.tlui-toolbar__inner {
					display: flex !important;
					flex-direction: column-reverse !important;
					justify-content: flex-end !important;
					align-items: flex-start !important;
					margin-top: 0.5rem;
				}

				.tlui-toolbar__extras {
					display: none !important;
				}

				.tlui-button__tool {
					height: 2rem !important;
					width: 2rem !important;
				}

				.tlui-button__tool:focus {
					background-color: var(--accent-5) !important;
					color: var(--accent-10) !important;
					border-radius: 8px !important;
				}
		`}</style>
			<Popover.Root>
				<Popover.Trigger>
					<IconButton m="3" variant="ghost" size="4" style={{width: "100%"}}>
						<ChevronRight size="15" />
					</IconButton>
				</Popover.Trigger>
				<Popover.Content side="right">
					<Grid columns="4" rows="repeat(auto-fill, 1fr)">
						{extraTools.map(([toolKey, tool]) => (
							<TldrawUiMenuItem key={toolKey} {...tool} />
						))}
					</Grid>
				</Popover.Content>
			</Popover.Root>
    </DefaultToolbar>
	);
}
