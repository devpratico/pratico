import { DefaultToolbar, ToolbarItem } from 'tldraw';

function ToolbarStyle () {

	return (
		<style>
		{`
			.tlui-toolbar__tools {
				flex-direction: column !important;
			}

			.tlui-toolbar__tools__list {
				flex-direction: column !important;
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

	return (
		<DefaultToolbar>
			<ToolbarStyle />
			{
				myTLTools.map((tool) => {
					
					return <ToolbarItem tool={tool} key={tool}/>
				})
			}
		</DefaultToolbar>
	);
}
