"use client";

import { Box, Heading, Text, Flex, IconButton } from "@radix-ui/themes";
import ReportWidgetTemplate from "./ReportWidgetTemplate";
import { TldrawImage, TLEditorSnapshot, TLPageId } from "tldraw";
import { Json } from "@/supabase/types/database.types";
import { CapsuleToPdfBtn } from "../../../../../_components/CapsuleToPdfBtn";
import Thumbnail from "@/app/(frontend)/[locale]/_components/Thumbnail";
import { FileDown } from "lucide-react";

interface CapsuleWidgetViewProps {
	data: {
		capsuleId: string;
		capsuleTitle: string;
		capsuleDate: string;
		capsuleSnapshot: Json | TLEditorSnapshot;
		firstPageId: string | undefined;
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
				{
					data.firstPageId
					?	<TldrawImage
							snapshot={data.capsuleSnapshot as TLEditorSnapshot}
							format='png'
							scale={0.05}
							background={true}
							pageId={data.firstPageId as TLPageId}
							padding={0}
						/>
					: null
				}
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
			snapshot={data.capsuleSnapshot}
			title={data.capsuleTitle}
			capsuleDate={data.capsuleDate}
			tooltip="Télécharger le diaporama modifié en pdf"
		>
			<IconButton variant="ghost">
				<FileDown />
			</IconButton>
		</CapsuleToPdfBtn>
	
	return (
		<ReportWidgetTemplate thumb={<Thumb />} content={<Content />} buttons={buttons} />
	);
}