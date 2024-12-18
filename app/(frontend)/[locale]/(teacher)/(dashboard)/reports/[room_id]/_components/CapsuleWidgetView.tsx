"use client";
import { Box, Button, DataList, IconButton, Link, Tooltip, Heading } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { FileDown } from "lucide-react";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import { Tldraw, TLEditorSnapshot } from "tldraw";
import { CapsuleToPdfDialog } from "../../../../(desk)/capsule/[capsule_id]/_components/CapsuleToPdfDialog";
import { useEffect, useState } from "react";
import { Json } from "@/supabase/types/database.types";

interface CapsuleWidgetViewProps {
	data: {
		capsuleId: string;
		capsuleTitle: string;
		capsuleDate: string;
		capsuleSnapshot: Json | TLEditorSnapshot;
		isRoom: boolean;
	}
}
export function CapsuleWidgetView({ data }: CapsuleWidgetViewProps) {
	const [ downloadClick, setDowloadClick ] = useState(false);

	useEffect(() => {	console.log(data.capsuleSnapshot, " SNAPSHOTS", downloadClick);
	}, [downloadClick, data.capsuleSnapshot]);
	const handleDownload = async () => {
		setDowloadClick(true);
		const timeout = setTimeout(() => {setDowloadClick(false)}, 1000);
		return (() => clearTimeout(timeout));
	};

	const Thumb = () => {
		return (
            <Box style={{borderRadius: "var(--radius-3)", boxShadow: "var(--shadow-4)", padding: "0", width: "100%", height: "auto"}}>
				<Thumbnail snapshot={data.capsuleSnapshot as TLEditorSnapshot} />
			</Box>
		);
	};
	const Content = () => {

        return (
			<Box>
				<Heading as='h2' size='4' mb='4'>Capsule</Heading>
				<DataList.Root size='1'>
					<DataList.Item>
						<DataList.Label>Titre</DataList.Label>
						<DataList.Value>{data.capsuleTitle}</DataList.Value>
					</DataList.Item>
					<DataList.Item>
						<DataList.Label>Date de création</DataList.Label>
						<DataList.Value>{data.capsuleDate}</DataList.Value>
					</DataList.Item>
				</DataList.Root>
			</Box>
            
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
					Ouvrir la capsule
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
				downloadClick && <Tldraw snapshot={data.capsuleSnapshot as TLEditorSnapshot}>
					<CapsuleToPdfDialog capsuleId={data.capsuleId} isRoom={data.isRoom} shortcut={true} />
				</Tldraw>
			}
		</>
	);
}