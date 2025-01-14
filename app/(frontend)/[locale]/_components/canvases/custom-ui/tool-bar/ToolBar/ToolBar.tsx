import styles from './ToolBar.module.css'
import DrawTool from '../DrawTool/DrawTool';
import SelectTool from '../SelectTool/SelectTool';
import EraserTool from '../EraserTool/EraserTool';
import TextTool from '../TextTool/TextTool';
import MediaTool from '../media-tool/MediaTool/MediaTool';
import ShapeTool from '../ShapeTool/ShapeTool';
import { ToolBarState } from '@/app/_utils/tldraw/toolBarState';
import { DefaultToolbar, TldrawUiMenuItem, useEditor, useTools } from 'tldraw';
import { Button, Grid, IconButton, Popover } from '@radix-ui/themes';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';


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
	const editor = useEditor();
	const currentToolId = editor.getCurrentToolId();
	const [selectedToolId, setSelectedToolId] = useState(currentToolId);
	const [ favorites, setFavorites ] = useState(["select", "eraser", "draw", "text", "note", "other"]);
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


	useEffect(() => {
		const isMainToolSelected = Object.keys(mainTools).find(tool => {
			return (tool === currentToolId);
		});
		if (!isMainToolSelected && currentToolId !== favorites[5]) {
			const newFavorites = [...favorites];
			newFavorites.splice(newFavorites.indexOf(currentToolId), 1);
			newFavorites.push(currentToolId);
			console.log("newFavorites", newFavorites);
			setFavorites(newFavorites);
		}
		console.log("favorites", favorites);
	}, [editor, favorites, currentToolId, mainTools]);

	useEffect(() => {
		console.log("selectedToolId", selectedToolId);
	}, [selectedToolId]);
  return (

    <DefaultToolbar>
		{mainTools.map(([toolKey, tool]) =>  (
			<IconButton key={toolKey} asChild color={selectedToolId === tool.id ? "green" : "lime"} onClick={() => {
				console.log("toolKey", toolKey, tool);
				setSelectedToolId(tool.id);
			}}>
				<TldrawUiMenuItem key={toolKey} {...tool} />
			</IconButton>
			
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
		`}</style>
			<Popover.Root>
				<Popover.Trigger>
					<IconButton m="4" variant="ghost" size="4" style={{width: "100%"}}>
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
