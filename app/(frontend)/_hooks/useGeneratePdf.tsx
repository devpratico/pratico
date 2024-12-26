"use client";
import jsPDF from "jspdf";
import { useState } from "react";
import { Editor, exportToBlob } from "tldraw";
import { defaultBox } from "../[locale]/_components/canvases/custom-ui/Resizer";
import logger from "@/app/_utils/logger";

export function useGeneratePdf(): {
    inProgress: boolean; // True while the PDF is being generated
    progress: number;    // Progress % of the PDF generation, from 0 to 100
    generatePdf(editor: Editor, filename: string): Promise<{ pdf: jsPDF, error: string | null} | undefined>;
} {
    const [inProgress, setInProgress] = useState(false);
    const [pagesProgress, setPagesProgress] = useState({loading: 0, total: 0});
	const [progress, setProgress] = useState(0);

	const createPdf = async (blobs: Blob[], pdf: jsPDF, filename: string) => {
		console.log("createPDF", blobs, pdf);
			for (let index = 0; index < blobs.length; index++) {
				const blob = blobs[index];
				const base64data = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				});
			
				try {
					pdf.addImage(base64data, "WEBP", 0, 0, defaultBox.w, defaultBox.h);
					if (index < blobs.length - 1) {
						pdf.addPage();
					}
				} catch (error) {
					logger.error("react:hook", "useGeneratePdf", "pdf.addImage", index, error);
				}
				setProgress((prev) => Math.min((prev || 0) + 100 / (blobs.length || 1), 100));
			}
	};

	const generatePdf = async (editor: Editor, filename: string) => {
		console.log("generatePDF", editor);
		if (!editor)
			return ;	
		const pdf = new jsPDF('landscape', 'px', [defaultBox.w, defaultBox.h]);
		const allBlobs: any[] = [];
		const allPages = editor.getPages();
	console.log("ALL PAGES", allPages);
		
		setPagesProgress({loading: 0, total: allPages.length});
		if (allPages.length === 0)
		{	
			setProgress(0);
		}
		try {
			for (let i = 0; i < allPages.length; i++) {
			  	const shapeIds = editor.getPageShapeIds(allPages[i]);
				console.log("ShapeIds", shapeIds);
				if (shapeIds.size === 0)
					continue;
				setPagesProgress((prev) => ({loading: prev?.loading + 1, total: prev?.total}));
				try {
					const blob = await exportToBlob({
					editor,
					ids: Array.from(shapeIds),
					format: 'webp',
					opts: {
						bounds: defaultBox,
						padding: 0,
						darkMode: false,
					}
					});
					allBlobs.push(blob);
				
					setProgress((prev) => Math.min((prev || 0) + 100 / (allPages.length || 1), 100));

				} catch (error) {
					logger.error("react:component", "CapsuleToPDFBtn", `Failed to get svgElement in page ${allPages[i].id}`, error);
				}
			}
		} catch (error) {
			logger.error("react:component", "CapsuleToPDFBtn", "handleExportAllPages", error);
		}
		if (allBlobs.length === 0)
		{
			setProgress(0);
		}
		const validBlobs = allBlobs.filter(blob => blob.size > 0) as Blob[];
		setProgress(0);
		await createPdf(validBlobs, pdf, filename);
		return ({ pdf: pdf, error: null });
	};

    return { inProgress, progress, generatePdf };
}