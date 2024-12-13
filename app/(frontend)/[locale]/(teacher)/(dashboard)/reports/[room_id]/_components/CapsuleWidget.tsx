import { Button, IconButton, Link, Tooltip } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { FileDown } from "lucide-react";

export function CapsuleWidget({ roomId, userId, capsuleTitle }: any) {
	const thumb = "";
	const content = "";
	const buttons = <>
			<Tooltip content="Imprimer / Exporter en PDF">
				<IconButton disabled={false}  variant="ghost" onClick={() => console.log("test")}>
					<FileDown />
				</IconButton>
			</Tooltip>
			<Button  radius="full" asChild>
				
					Détails
			</Button>
		</>;

	return (
		<div>
			<ReportWidgetTemplate
				thumb={thumb}
				content={content}
				buttons={buttons}
			/>
		</div>
	);
}