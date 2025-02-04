import {  ToolbarItem, TldrawUiMenuContextProvider, DefaultStylePanel, DefaultStylePanelContent, useRelevantStyles } from 'tldraw';
import { Flex, Popover, IconButton, Grid } from '@radix-ui/themes';
import { ChevronRight, PaletteIcon } from 'lucide-react';

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
    return (
        <Flex direction='column' align='center' style={toolbarStyle}>
            <TldrawUiMenuContextProvider type='toolbar' sourceId='toolbar'>
                {mainTools.map((tool) => <ToolbarItem tool={tool} key={tool} />)}
                <Popover.Root >
                <Popover.Trigger>
                    <IconButton m="2" variant="ghost" size="4"><ChevronRight size={32} /></IconButton>
                </Popover.Trigger>

                <Popover.Content sideOffset={0} side="right">
                    <Grid columns="4">
                        {extraTools.map((tool) => <ToolbarItem tool={tool} key={tool} />)}
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
    "laser",
    "highlight"
];

const extraTools = [
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