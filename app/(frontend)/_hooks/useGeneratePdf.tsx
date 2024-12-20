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
		const processBlob = async (index: number) => {
			if (index >= blobs.length) {
				setProgress(0);
				console.log("PDF GENERATED", pdf);
				return ;
			}
			const blob = blobs[index];
			setPagesProgress((prev) => ({loading: index + 1, total: prev?.total}));
			const reader = new FileReader();
			reader.onload = async () => {
				const base64data = reader.result as string;
				try {
					pdf.addImage(base64data, "WEBP", 0, 0, defaultBox.w, defaultBox.h);
				} catch (error) {
					logger.error("react:hook", "useGeneratePdf", "pdf.addImage", index, error);
				}

				if (index < blobs.length - 1) {
					pdf.addPage();
				}
				setProgress((prev) => Math.min((prev || 0) + 100 / (blobs.length || 1), 100));

				const timeout = setTimeout(() => {processBlob(index + 1)}, 100);
				return (() => clearTimeout(timeout));
			};
			reader.onerror = (error) => {
				logger.error("react:component", "CapsuleToPDFBtn", "FileReader", index, error);
			};
			reader.readAsDataURL(blob);
		};

		try {
			await processBlob(0);
		} catch (error) {
			logger.error("react:component", "CapsuleToPDFBtn", "createPdf", error);
		};
	};

	const generatePdf = async (editor: Editor, filename: string) => {
		console.log("generatePDF", editor);
		if (!editor)
			return ;	
		const pdf = new jsPDF('landscape', 'px', [defaultBox.w, defaultBox.h]);
		const allBlobs: any[] = [];
		const allPages = editor.getPages();

		
		setPagesProgress({loading: 0, total: allPages.length});
		if (allPages.length === 0)
		{	
			setProgress(0);
		}
		try {
			for (let i = 0; i < allPages.length; i++) {
			  	const shapeIds = editor.getPageShapeIds(allPages[i]);
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
		return ({pdf: pdf, error: null});
	};

    return { inProgress, progress, generatePdf };
}