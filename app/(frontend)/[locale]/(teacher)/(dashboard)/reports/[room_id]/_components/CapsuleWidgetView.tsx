"use client";

import { Box, Heading, Text, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { TLEditorSnapshot } from "tldraw";
import { Json } from "@/supabase/types/database.types";
import { CapsuleToPdfBtn } from "./CapsuleToPdfShorcutBtn";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import { FileDown } from "lucide-react";

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
            <Flex
                align={'center'}
                justify={'center'}
                style={{
                    borderRadius: "var(--radius-3)",
                    boxShadow: "var(--shadow-4)",
                    width: "190px",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    backgroundColor: "var(--gray-5)",
                }}
            >	
				<Thumbnail snapshot={data.capsuleSnapshot as TLEditorSnapshot} />
			</Flex>
		);
	};
	const Content = () => {

        return (
			<Box>
				<Heading as='h2' size='4' mb='4'>Diaporama</Heading>
				<Text as="p" size="1" style={{color: "var(--gray-8)"}}>
                    {`Retrouvez le résultat de votre capsule modifiée lors de la session 
                    (ajout de dessins, de pages, de post-its...) 
                    au format PDF en cliquant sur le bouton ci-dessous.`}
                </Text>
			</Box>
        );
    }
	const buttons = 
	
	<CapsuleToPdfBtn
		snapshot={data.capsuleSnapshot as TLEditorSnapshot}
		title={data.capsuleTitle}
		capsuleDate={data.capsuleDate}
	>
		<Tooltip content='Télécharger le diaporama modifié en PDF'>
			<IconButton variant='ghost'>
				<FileDown />
			</IconButton>
		</Tooltip>
	</CapsuleToPdfBtn>

	return (
		<ReportWidgetTemplate thumb={<Thumb />} content={<Content />} buttons={buttons} />
	);
}