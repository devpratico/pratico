"use client";

import { Box, Button, DataList, Link, Heading } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import { TLEditorSnapshot } from "tldraw";
import { useEffect, useState } from "react";
import { Json } from "@/supabase/types/database.types";
import { CapsuleToPdfShortcutBtn } from "./CapsuleToPdfShorcutBtn";

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
				<Heading as='h2' size='4' mb='4'>Diaporama</Heading>
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
			<CapsuleToPdfShortcutBtn snapshot={data.capsuleSnapshot as TLEditorSnapshot} capsuleId={data.capsuleId} isRoom={data.isRoom} />
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
		</>
	);
}