import {  ToolbarItem, TldrawUiMenuContextProvider, DefaultStylePanel } from 'tldraw';
import { Flex, Popover, IconButton, Grid } from '@radix-ui/themes';
import { ChevronRight, PaletteIcon } from 'lucide-react';
import { useState } from 'react';

export function CustomTlToolbar() {
	return (
        <Flex>
            <Flex direction='column' gap="3" m="4" align="center">
                <Palette/>
                <Toolbar/>
            </Flex>
        </Flex>
	);
}



function Toolbar() {
    const [ dynamicTool, setDynamicTool ] = useState<string>("highlight");

    const handleClick = (tool: string) => {
        if (extraTools.includes(tool))
            setDynamicTool(tool);
    };
    return (
        <Flex direction='column' align='center' style={toolbarStyle}>
            <TldrawUiMenuContextProvider type='toolbar' sourceId='toolbar'>
                {mainTools.map((tool) => <ToolbarItem tool={tool} key={tool} />)}
                <ToolbarItem tool={dynamicTool} />
                <Popover.Root >
                    <Popover.Trigger>
                        <IconButton m="2" variant="ghost" size="4"><ChevronRight size={32} /></IconButton>
                    </Popover.Trigger>

                    <Popover.Content onClick={(event) => {
                        const target = (event.target as HTMLElement).closest('[data-tool]');
                        if (!target)
                        return ;
                        const tool = target.getAttribute('data-tool');
                        if (tool)
                            handleClick(tool);
                    }} sideOffset={0} side="right">
                        <Grid columns="4">
                            {extraTools.map((tool) => 
                                <div key={tool} data-tool={tool}>
                                    <ToolbarItem tool={tool} key={tool} />
                                </div>
                            )}
                        </Grid>
                    </Popover.Content>
                </Popover.Root>
            </TldrawUiMenuContextProvider>
            <style>{toolStyle}</style>
        </Flex>
    )
}

function Palette() {
    // const styles = useRelevantStyles();

    return (
        <Popover.Root >
            <Popover.Trigger style={{ zIndex: 100 }}>
                <IconButton variant="ghost" size="4"><PaletteIcon size={32} /></IconButton>
            </Popover.Trigger>

            <Popover.Content sideOffset={1} alignOffset={1} side="right">
                <DefaultStylePanel />
                {/* <DefaultStylePanelContent styles={styles}/> */}
            </Popover.Content>
        </Popover.Root>
    )
}

const toolbarStyle: React.CSSProperties = {
    zIndex: 100,
    backgroundColor: 'var(--accent-1)',
    boxShadow: 'var(--shadow-3)',
    borderRadius: 'var(--radius-3)',
};

const toolStyle = `
.tlui-button__tool {
    margin-left:  0px !important;
    margin-right: 0px !important;
}
`



const mainTools = [
    "select",
    "eraser",
    "draw",
    "note",
    "asset",
    "text",
    "laser"];

const extraTools = [
    "highlight",
    "cloud",
    "rectangle",
    "ellipse",
    "triangle",
    "diamond",
    "pentagon",
    "hexagon",
    "octagon",
    "star",
    "rhombus",
    "rhombus-2",
    "oval",
    "trapezoid",
    "arrow-right",
    "arrow-left",
    "arrow-up",
    "arrow-down",
    "x-box",
    "check-box",
    "heart",
    "arrow",
    "line",
    "embed",
];