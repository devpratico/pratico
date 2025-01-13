import styles from './ToolBar.module.css'
import DrawTool from '../DrawTool/DrawTool';
import SelectTool from '../SelectTool/SelectTool';
import EraserTool from '../EraserTool/EraserTool';
import TextTool from '../TextTool/TextTool';
import MediaTool from '../media-tool/MediaTool/MediaTool';
import ShapeTool from '../ShapeTool/ShapeTool';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';
import { DefaultToolbar, TldrawUiMenuItem, useTools } from 'tldraw';
import { Box, DropdownMenu, Grid, IconButton, Popover } from '@radix-ui/themes';
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
	const favorites = ["select", "eraser", "draw", "text", "note"];
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
    ? [praticoTools.slice(0, 5), praticoTools.slice(5)]
    : [praticoTools, []];

  return (

    <DefaultToolbar  >
			{mainTools.map(([toolKey, tool]) => (
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
					flex-direction: row-reverse !important;
					justify-content: flex-end !important;
					align-items: center !important;
				}
		`}</style>
			<Popover.Root>
				<Popover.Trigger>
					<IconButton variant="soft" size="4" style={{width: "100%"}}>
						<ChevronRight size="15" />
					</IconButton>
				</Popover.Trigger>
				<Popover.Content side="right">
					<Grid columns="4fr 4fr 4fr 4fr">
					{extraTools.map(([toolKey, tool]) => (
						<Grid rows="auto" key={toolKey}>
							<TldrawUiMenuItem {...tool} />
						</Grid>
					))}
					</Grid>
				</Popover.Content>
			</Popover.Root>

			{/* {extraTools.length > 0 && (
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<IconButton variant="soft" size="4" style={{width: "100%"}}>
							<DropdownMenu.TriggerIcon />
							<ChevronRight size="15" />
						</IconButton>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="right">

						{extraTools.map(([toolKey, tool]) => (
							<DropdownMenu.Item key={toolKey}>
								<TldrawUiMenuItem {...tool} />
							</DropdownMenu.Item>
						))}

					</DropdownMenu.Content>
				</DropdownMenu.Root>
			)} */}
      	{/* </Box> */}
    </DefaultToolbar>
	);
}
