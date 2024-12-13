"use client";
import { Button, DataList, IconButton, Link, Strong, Tooltip } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { FileDown } from "lucide-react";

interface CapsuleWidgetViewProps {
	data: {
		capsuleId: string;
		capsuleTitle: string;
		capsuleDate: string;
	}
}
export function CapsuleWidgetView({ data }: CapsuleWidgetViewProps) {
	const Thumb = () => {
		return (<>
			<div style={{width: "100px", height: "100px", backgroundColor: "gray"}}></div>
		</>);
	};
	const Content = () => {

        return (
			<>
				<DataList.Root size='1'>
				<DataList.Item>
						<DataList.Label>Titre</DataList.Label>
						<DataList.Value>{data.capsuleTitle}</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Créer le</DataList.Label>
						<DataList.Value>{data.capsuleDate}</DataList.Value>
					</DataList.Item>
				</DataList.Root>
			</>
            
        );
    }
	const buttons = <>
			<Tooltip content="Exporter en PDF">
				<IconButton disabled={false}  variant="ghost" onClick={() => console.log("test")}>
					<FileDown />
				</IconButton>
			</Tooltip>
			<Button radius="full" asChild>
				<Link href={`/capsules/${data.capsuleId}`}>
					Détails
				</Link>
			</Button>
		</>;

	return (
		<div>
			<ReportWidgetTemplate
				thumb={<Thumb />}
				content={<Content />}
				buttons={buttons}
			/>
		</div>
	);
}