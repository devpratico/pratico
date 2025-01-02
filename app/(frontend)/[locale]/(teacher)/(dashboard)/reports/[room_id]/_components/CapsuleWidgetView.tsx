"use client";

import { Box, Heading, Text } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { TLEditorSnapshot } from "tldraw";
import { Json } from "@/supabase/types/database.types";
import { CapsuleToPdfShortcutBtn } from "./CapsuleToPdfShorcutBtn";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";

interface CapsuleWidgetViewProps {
	data: {
		capsuleId: string;
		capsuleTitle: string;
		capsuleDate: string;
		capsuleSnapshot: Json | TLEditorSnapshot;
	}
}
export function CapsuleWidgetView({ data }: CapsuleWidgetViewProps) {
	const Thumb = () => {
		return (
            <Box style={{ borderRadius: "var(--radius-3)", boxShadow: "var(--shadow-4)", width: "100%", aspectRatio: "16/9", overflow: "hidden" }} >	
				<Thumbnail snapshot={data.capsuleSnapshot as TLEditorSnapshot} />
			</Box>
		);
	};
	const Content = () => {

        return (
			<Box>
				<Heading as='h2' size='4' mb='4'>Diaporama</Heading>
				<Text as="p" size="1" style={{color: "var(--gray-8)"}}>{"Si vous avez modifié la capsule lors de la session (ajout de dessins, de pages, de post-its...), vous pouvez récupérer le résultat au format pdf en cliquant sur le bouton ci-dessous."}</Text>
			</Box>
        );
    }
	const buttons = <CapsuleToPdfShortcutBtn snapshot={data.capsuleSnapshot as TLEditorSnapshot} title={data.capsuleTitle} capsuleDate={data.capsuleDate} />;

	return (
		<ReportWidgetTemplate thumb={<Thumb />} content={<Content />} buttons={buttons} />
	);
}