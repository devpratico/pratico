import {  ToolbarItem, TldrawUiMenuContextProvider, useRelevantStyles, DefaultStylePanelContent, DefaultStylePanel } from 'tldraw';
import { Flex, Popover, IconButton, Grid, FlexProps, Box } from '@radix-ui/themes';
import { ChevronRight, ChevronUp, PaletteIcon } from 'lucide-react';
import { useState } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';




export function CustomTlToolbar() {
	return (
        <TldrawUiMenuContextProvider type='toolbar' sourceId='toolbar'>


            <Flex
                display={{ initial: 'none', xs: 'flex' }}
                position='absolute'
                left="2"
                style={{ zIndex: 1 }}
                align='center'
                justify='center'
                height='100%'
            >
                <ClassicToolbar/>
            </Flex>


            <Flex
                display={{initial: 'flex', xs: 'none'}}
                position='absolute'
                bottom='2'
                style={{ zIndex: 1 }}
                align='center'
                justify='center'
                width='100%'
            >
                <SmallerScreenToolbar />
            </Flex>

        </TldrawUiMenuContextProvider>
	);
}

function ClassicToolbar(props: FlexProps) {
    return (
        <Flex direction="column" gap="5" m="4" align="center" {...props}>
            <Palette />
            <Toolbar />
        </Flex>
    )
}

function SmallerScreenToolbar(props: FlexProps) {
    return (
        <Flex gap="3" align="center" {...props}>
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
        
            <Flex p="2" direction='column' align='center' style={toolbarStyle}>

                {mainTools.map((tool) => <ToolbarItem tool={tool} key={tool} />)}

                <ToolbarItem tool={dynamicTool} />
                <Popover.Root >
                    <Popover.Trigger>
                        <IconButton m="0" variant="ghost" size="4"><ChevronRight size={32} /></IconButton>
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
                    {mainToolsMobile.map((tool) => <ToolbarItem tool={tool} key={tool}/>)}
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
                <style>{toolStyle}</style>
            </Flex>

    )
}

function Palette({smallScreen = false}: {smallScreen?: boolean}) {
    //const styles = useRelevantStyles();
    
    return (
        <PopoverPrimitive.Root >
            <PopoverPrimitive.Trigger style={{ backgroundColor: "var(--accent-1)",  boxShadow: 'var(--shadow-3)'}} asChild>
                <IconButton radius="full" variant="ghost" size={smallScreen ? "3" : "4"}><PaletteIcon size={32} /></IconButton>
            </PopoverPrimitive.Trigger>

            <PopoverPrimitive.Portal container={document.getElementsByClassName('tldraw-canvas')[0] as HTMLElement}>
                <PopoverPrimitive.Content
                    //sideOffset={1}
                    //alignOffset={1}
                    side={smallScreen ? "top" : "right"}
                    style={{zIndex: 10000}}
                >
                        <DefaultStylePanel />
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    )
}

const toolbarStyle: React.CSSProperties = {
    backgroundColor: 'var(--accent-1)',
    boxShadow: 'var(--shadow-2)',
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