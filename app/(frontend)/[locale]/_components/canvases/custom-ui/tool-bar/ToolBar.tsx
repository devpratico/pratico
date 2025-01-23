import { useTLEditor } from '@/app/(frontend)/_hooks/contexts/useTLEditor';
import useWindow from '@/app/(frontend)/_hooks/contexts/useWindow';
import { useEffect } from 'react';
import { DefaultColorStyle, DefaultToolbar, ToolbarItem } from 'tldraw';

function ToolbarStyle ({isMobile}: {isMobile: boolean}) {
	if (isMobile)
		return (
			<style>
			{`
				.tl-container {
					display: flex !important;
					justify-content: column-reverse !important;
					align-items: flex-end !important;
				}
				.tlui-toolbar {
					margin-bottom: 0.5rem; !important;
					z-index: 1 !important;
				}
				.tlui-button__tool {
					align-items: center !important;
				}
			`}
			</style>
	);
	return (
		<style>
		{`
			.tlui-toolbar__tools {
				flex-direction: column !important;
			}

			.tlui-toolbar__tools__list {
				flex-direction: column !important;
				justify-content: flex-start !important;
				align-items: center !important;
			}

			.tlui-toolbar {
				justify-content: start !important;
				height: 100% !important;
				margin-left: 0.5rem;
			}
			.tlui-toolbar__inner {
				display: flex !important;
				flex-direction: column-reverse !important;
				justify-content: flex-end !important;
				align-items: flex-start !important;
			}

			.tlui-toolbar__extras {
				display: none !important;
			}
		`}
		</style>
	);
};

const myTLTools = [
	"select",
	"eraser",
	"draw",
	"note",
	"asset",
	"text",
	"laser",
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

export function CustomTlToolbar() {
	const { widerThan } = useWindow();
	const { editor } = useTLEditor();
	
    useEffect(() => {
        editor?.setStyleForNextShapes(DefaultColorStyle, 'violet');
    }, [editor])
	return (
		<DefaultToolbar>
			<ToolbarStyle isMobile={!widerThan('xs')}/>
			{
				myTLTools.map((tool) => <ToolbarItem tool={tool} key={tool}/>)
			}
		</DefaultToolbar>
	);
}
