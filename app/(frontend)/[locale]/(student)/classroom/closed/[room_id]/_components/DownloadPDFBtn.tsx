"use client";
import { Json } from "@/supabase/types/database.types";
import { Button } from "@radix-ui/themes";
import { FileDown } from "lucide-react";
import { TLEditorSnapshot } from "tldraw";

export function DownloadPDFBtn({ capsuleSnapshot }: { capsuleSnapshot: TLEditorSnapshot | Json[]}) {
	const snapshot = capsuleSnapshot as TLEditorSnapshot;
	const handleClick = () => {
		// Download the pdf
		console.log("PDF telecharge !");
	};
	return (<Button onClick={handleClick} size='4'><FileDown/>Télécharger le support en pdf</Button>);
}