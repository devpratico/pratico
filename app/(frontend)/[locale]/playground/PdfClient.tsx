"use client";
import createClient from "@/supabase/clients/client";
import { Box, Button } from "@radix-ui/themes";
import { PDFDocument } from "pdf-lib";

export function PfdClient ({pdfUrl}: {pdfUrl?: any}) {
	const supabase = createClient();

	const handleClick = async () => {
			const capsuleId = "5472eac2-6b57-4114-806e-3a3ec6031f1e";
			let pdfUrl = "";
			try
			{
				const { data, error } = await supabase.from('capsules').select('metadata').eq('id', capsuleId).single();
				if (error) {
					console.error("Error fetching metadata:", error, data);
					return (null);
				}
				if (!("metadata" in data)) {
					console.error("Metadata not found in data:", data);
					return null;
				}
				const pdfDoc = await PDFDocument.create();
				const metadata = data.metadata as { data: Record<string, string> | string[] };
				if ("metadata" in data && "data" in metadata) {
					const svgPaths: string[] = Array.isArray(metadata.data)
					? metadata.data
					: Object.values(metadata.data);
			
					const pdfDoc = await PDFDocument.create();
			
					for (const path of svgPaths) {
						if (typeof path !== "string") {
							console.error("Invalid SVG path:", path);
							continue;
						}
			
						const page = pdfDoc.addPage();
						page.drawSvgPath(path);
					}
				}
				const pdfBytes = await pdfDoc.save();
				const pdfUrl = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }));
				console.log("PDF URL", pdfUrl);
				window.open(pdfUrl, "_blank");
			} catch (error) {
				console.error("Failed to create PDF", error);
			}
		}
		return (
			<Box> 
				<Button onClick={handleClick}>Download PDF</Button>
			</Box>
		);
};
