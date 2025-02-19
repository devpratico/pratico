"use client";
import createClient from "@/supabase/clients/client";
import { Box, Button } from "@radix-ui/themes";
import { PDFDocument } from "pdf-lib";

export function PfdClient ({pdfUrl}: {pdfUrl?: any}) {
	const supabase = createClient();

	const handleClick = async () => {
			const capsuleId = "10c07317-af38-4014-9f4c-b86725faff03";
			let pdfUrl = "";
			try
			{
				const { data, error } = await supabase.from('capsules').select('metadata').eq('id', capsuleId).single<any>();
				if (error) {
					console.error("Error fetching metadata:", error);
					return (null);
				}
				if (!data || data.length === 0) 
					return (null);
				const svgPaths: string[] = Array.isArray(data.metadata.data)
				? data.metadata.data
				: Object.values(data.metadata.data);
		
				const pdfDoc = await PDFDocument.create();
		
				for (const path of svgPaths) {
					if (typeof path !== "string") {
						console.error("Invalid SVG path:", path);
						continue;
					}
		
					const page = pdfDoc.addPage();
					page.drawSvgPath(path, {
						x: 50,
						y: page.getHeight() - 50
					});
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
