"use client";
import { Button, Card, DataList, Flex, IconButton, Link, Strong, Tooltip } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { FileDown } from "lucide-react";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import { TLEditorSnapshot } from "tldraw";
import { CapsuleToPdfDialog } from "../../../../(desk)/capsule/[capsule_id]/_components/CapsuleToPdfDialog";
import { useState } from "react";

interface CapsuleWidgetViewProps {
	data: {
		capsuleId: string;
		capsuleTitle: string;
		capsuleDate: string;
		capsuleSnapshot: TLEditorSnapshot;
		isRoom: boolean;
	}
}
export function CapsuleWidgetView({ data }: CapsuleWidgetViewProps) {
	const [ downloadClick, setDowloadClick ] = useState(false);

	const handleDownload = () => {
		setDowloadClick(true);
	};

	const Thumb = () => {
		return (<>
            <Card style={{width: "100%", height: "auto"}}>
				<Thumbnail snapshot={data.capsuleSnapshot} />
			</Card>
		</>);
	};
	const Content = () => {

        return (
			<>
				<Strong>Capsule</Strong>
				<DataList.Root size='1'>
					<DataList.Item>
						<DataList.Label>Titre</DataList.Label>
						<DataList.Value>{data.capsuleTitle}</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Créer le</DataList.Label>
						<DataList.Value>{data.capsuleDate}</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label></DataList.Label>
						<DataList.Value></DataList.Value>
					</DataList.Item>
				</DataList.Root>
			</>
            
        );
    }
	const buttons = <>
			<Tooltip content="Exporter en PDF">
				<IconButton disabled={false}  variant="ghost" onClick={handleDownload}>
					<FileDown />
				</IconButton>
			</Tooltip>
			<Button radius="full" asChild>
				<Link href={`/capsule/${data.capsuleId}`}>
					Détails
				</Link>
			</Button>
		</>;

	return (
		<>
			<ReportWidgetTemplate
				thumb={<Thumb />}
				content={<Content />}
				buttons={buttons}
			/>
			{
				downloadClick && <CapsuleToPdfDialog capsuleId={data.capsuleId} isRoom={data.isRoom} shortcut={true} />
			}
		</>
	);
}