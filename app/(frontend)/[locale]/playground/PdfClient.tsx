"use client";
import { Box, Button } from "@radix-ui/themes";

export function PfdClient ({pdfUrl}: {pdfUrl: string}) {

	const handleClick = () => {
		if (!pdfUrl)
			return (console.log("No PDF URL"));
		try {
			window.open(pdfUrl, '_blank');
			return (() => URL.revokeObjectURL(pdfUrl));
		} catch (error) {
			console.error("Failed to open PDF", error);
		}
	};
	return (
		<Box> 
			<Button onClick={handleClick}>Download PDF</Button>
		</Box>
	  );
};
