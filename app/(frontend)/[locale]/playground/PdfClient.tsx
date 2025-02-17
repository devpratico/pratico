"use client";
import { Box, Button } from "@radix-ui/themes";

export function PfdClient ({pdfUrl}: {pdfUrl: string}) {

	return (
		<Box> 
			<Button onClick={() => window.open(pdfUrl)}>Download PDF</Button>
		</Box>
	  );
};