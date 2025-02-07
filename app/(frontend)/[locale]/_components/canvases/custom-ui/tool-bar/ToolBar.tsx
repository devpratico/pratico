import {  ToolbarItem, TldrawUiMenuContextProvider, DefaultStylePanel } from 'tldraw';
import { Flex, Popover, IconButton, Grid } from '@radix-ui/themes';
import { ChevronRight, ChevronUp, PaletteIcon } from 'lucide-react';
import { useState } from 'react';
import useWindow from '@/app/(frontend)/_hooks/contexts/useWindow';

export function CustomTlToolbar() {
    const { widerThan } = useWindow();

	return (
        <Flex align={widerThan("xs") ? "center" : "end"} justify="center" height="80vh">
           { widerThan('xs') ? <ClassicToolbar /> : <SmallerScreenToolbar /> }
        </Flex>
	);
}

function ClassicToolbar() {
    return (
        <Flex direction="column" gap="5" m="4" align="center">
            <Palette />
            <Toolbar />
        </Flex>
    )
}

function SmallerScreenToolbar() {
    return (
        <Flex gap="3" align="center">
            <ToolbarMobile />
            <Palette smallScreen />
        </Flex>
    )
}

function Toolbar() {
    const [ dynamicTool, setDynamicTool ] = useState<string>("embed");

    const handleClick = (tool: string) => {
        if (extraTools.includes(tool))
            setDynamicTool(tool);
    };
    return (
        <Flex pr="2" pl="2" direction='column' align='center' style={toolbarStyle}>
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
                    }} sideOffset={1} alignOffset={1} side="right">
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

function ToolbarMobile() {
    const [ dynamicTool, setDynamicTool ] = useState<string>("text");

    const handleClick = (tool: string) => {
        if (extraToolsMobile.includes(tool))
            setDynamicTool(tool);
    };
    return (
        <Flex align='center' style={toolbarStyle} >
            <TldrawUiMenuContextProvider type='toolbar' sourceId='toolbar'>
                {mainToolsMobile.map((tool) => <ToolbarItem tool={tool} key={tool} />)}
                <ToolbarItem tool={dynamicTool} />
                <Popover.Root >
                    <Popover.Trigger>
                        <IconButton m="2" variant="ghost" size="4"><ChevronUp size={32} /></IconButton>
                    </Popover.Trigger>

                    <Popover.Content onClick={(event) => {
                        const target = (event.target as HTMLElement).closest('[data-tool]');
                        if (!target)
                            return ;
                        const tool = target.getAttribute('data-tool');
                        if (tool)
                            handleClick(tool);
                    }} sideOffset={1} alignOffset={1} side="top">
                        <Grid columns="4">
                            {extraToolsMobile.map((tool) => 
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

function Palette({smallScreen = false}: {smallScreen?: boolean}) {

    return (
        <Popover.Root >
            <Popover.Trigger style={{ backgroundColor: "var(--accent-1)", zIndex: 1, boxShadow: 'var(--shadow-3)'}} >
                <IconButton radius="full" variant="ghost" size={smallScreen ? "3" : "4"}><PaletteIcon size={32} /></IconButton>
            </Popover.Trigger>

            <Popover.Content sideOffset={1} alignOffset={1} side={smallScreen ? "top" : "right"} style={toolbarStyle}>
                <DefaultStylePanel />
            </Popover.Content>
        </Popover.Root>
    )
}

const toolbarStyle: React.CSSProperties = {
    zIndex: 1,
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
    "draw",
    "highlight", 
    "eraser",
    "note",
    "text",   
    "asset"
];

const extraTools = [
    "embed",
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
    "laser"
];

const mainToolsMobile = [
    "select",
    "draw",
    "highlight", 
    "eraser",
    "note",

];

const extraToolsMobile = [
    "text",   
    "asset",
    "embed",
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
    "laser"
];