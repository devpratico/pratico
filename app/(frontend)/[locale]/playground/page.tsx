"use client";

import { Box, Container, Section } from "@radix-ui/themes";
import { Tldraw, TldrawUi, TldrawEditor, DefaultToolbar } from "tldraw";
import "tldraw/tldraw.css";
import { CustomTlToolbar } from "../_components/canvases/custom-ui/tool-bar/ToolBar/ToolBar";


export default function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}

    return (
		<Container>

			<Section height='50vh'>
			<Tldraw
				forceMobile
				components={{Toolbar: DefaultToolbar}}
			/>
			</Section>

			<Section height='50vh'>
				<Tldraw>
					<TldrawEditor >
						{/* <DefaultToolbar /> */}
						<TldrawUi/>
					</TldrawEditor>
				</Tldraw>
			</Section>
		</Container>
);
};

