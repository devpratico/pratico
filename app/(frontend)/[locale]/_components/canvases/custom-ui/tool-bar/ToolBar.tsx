import {  ToolbarItem, TldrawUiMenuContextProvider, DefaultStylePanel } from 'tldraw';
import { Flex, Popover, IconButton, Button } from '@radix-ui/themes';

export function CustomTlToolbar() {
	return (
        <Flex>
            <Flex direction='column'>
                <Palette/>
                {/* <Toolbar/> */}
            </Flex>
            
        </Flex>
	);
}



function Toolbar() {
    return (
        <Flex direction='column' align='center' style={toolbarStyle}>
            <TldrawUiMenuContextProvider type='toolbar' sourceId='toolbar'>
                {/* <DefaultStylePanel/> */}
                {mainTools.map((tool) => <ToolbarItem tool={tool} key={tool} />)}
            </TldrawUiMenuContextProvider>
            <style>{toolStyle}</style>
        </Flex>
    )
}

function Palette() {
    return (
        <Popover.Root>
            <Popover.Trigger>
                <Button>Palette</Button>
            </Popover.Trigger>

            <Popover.Content>
                Hello
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