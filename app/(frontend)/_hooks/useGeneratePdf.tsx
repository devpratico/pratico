"use client";
import jsPDF from "jspdf";
import { useState } from "react";
import { Editor, exportToBlob } from "tldraw";
import { defaultBox } from "../[locale]/_components/canvases/custom-ui/Resizer";
import logger from "@/app/_utils/logger";
import { log } from "console";

export function useGeneratePdf(): {
    inProgress: boolean; // True while the PDF is being generated
	pagesProgress: { loading: number, total: number };
    progress: number;    // Progress % of the PDF generation, from 0 to 100
    generatePdf(editor: Editor): Promise<{ pdf: jsPDF, error: string | null} | undefined>;
} {
    const [inProgress, setInProgress] = useState(false);
    const [pagesProgress, setPagesProgress] = useState({loading: 0, total: 0});
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const createPdf = async (blobs: Blob[], pdf: jsPDF) => {
			if (blobs.length === 0)
			{	
				setError("Aucun élément à exporter");
				return ;
			}
			setInProgress(false);
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
					setPagesProgress((prev) => ({ loading: index, total: prev?.total }));
				} catch (error) {
					logger.error("react:hook", "useGeneratePdf", "pdf.addImage", index, error);
					setError("Une erreur est survenue lors de la création du pdf");
				}
				setProgress((prev) => Math.min((prev || 0) + 100 / (blobs.length || 1), 100));
			}
	};

	const generatePdf = async (editor: Editor) => {
		if (!editor)
			return ;	
		const pdf = new jsPDF('landscape', 'px', [defaultBox.w, defaultBox.h]);
		const allBlobs: any[] = [];
		const allPages = editor.getPages();
		
		setPagesProgress({ loading: 0, total: allPages.length });
		if (allPages.length === 0)
		{	
			setProgress(0);
		}
		setInProgress(true);
		if (pagesProgress.total === 0)
			setPagesProgress({ loading: 0, total: allPages.length });
		try {
			for (let i = 0; i < allPages.length; i++) {
				logger.error("react:hook", "UseGeneratePDF", `Exporting page ${allPages[i].id}`);
			  	const shapeIds = editor.getPageShapeIds(allPages[i]);
				logger.error("react:hook", "UseGeneratePDF", "shapeIds:", shapeIds, "i:", i);
				if (shapeIds.size === 0)
					continue;
				logger.error("react:hook", "UseGeneratePDF", "i:", i, "shapeIds:", shapeIds);
				setPagesProgress((prev) => ({ loading: i, total: prev?.total }));
				logger.error("react:hook", "UseGeneratePDF", `${{
					editor,
					ids: Array.from(shapeIds),
					format: 'webp',
					opts: {
						bounds: defaultBox,
						padding: 0,
						darkMode: false,
					}
					}}`);
				try {
					logger.error("react:hook", "UseGeneratePDF", "Exporting to blob");
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
					logger.error("react:hook", "UseGeneratePDF", `Blob ${blob}`);
					allBlobs.push(blob);
					setProgress((prev) => Math.min((prev || 0) + 100 / (allPages.length || 1), 100));

				} catch (error) {
					logger.error("react:hook", "UseGeneratePDF", `Failed to get svgElement in page ${allPages[i].id}`, error);
					setError("Une erreur est survenue lors de la convertion des pages");
				}
			}
		} catch (error) {
			logger.error("react:hook", "UseGeneratePDF", "handleExportAllPages", error);
			setError(`Une erreur est survenue lors de la convertion des pages: ${error}`);
		}
		if (allBlobs.length === 0)
		{
			setProgress(0);
		}
		const validBlobs = allBlobs.filter(blob => blob.size > 0) as Blob[];
		setProgress(0);
		setPagesProgress({ loading: 0, total: validBlobs.length });
		await createPdf(validBlobs, pdf);
		setProgress(0);
		return ({ pdf: pdf, error: error });
	};

    return { inProgress, pagesProgress, progress, generatePdf };
}