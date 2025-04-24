"use client";
import jsPDF from "jspdf";
import { useState } from "react";
import { Editor, exportToBlob } from "tldraw";
import { defaultBox } from "../[locale]/_components/canvases/custom-ui/Resizer";
import logger from "@/app/_utils/logger";
import { deleteFileFromSupabaseBucketCapsulesPdf, uploadToSupabaseBucketCapsulesPdf } from "../[locale]/(teacher)/(desk)/capsule/[capsule_id]/_components/CapsuleToPdfDialog";
import createClient from "@/supabase/clients/client";

export function useGeneratePdf(): {
    inProgress: boolean; // True while the PDF is being generated
	pagesProgress: { loading: number, total: number };
    progress: number;    // Progress % of the PDF generation, from 0 to 100
    generatePdf(editor: Editor): Promise<{ blob: Blob | null, error: string | null}>;
} {
	const supabase = createClient();
    const [inProgress, setInProgress] = useState(false);
    const [pagesProgress, setPagesProgress] = useState({loading: 0, total: 0});
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const generatePdf = async (editor: Editor) => {
		const blobsUrls = await getJPGBlobsUrl(editor);
		if (!blobsUrls || blobsUrls.length === 0) {
		  setError("Échec de la récupération des données de la capsule");
		  return ({ blob: null, error: "Failed to get blobs" });
		}
		setProgress(0);
		let progressInterval;
		try {
		  progressInterval = setInterval(() => {
			setProgress((prev) => Math.min(prev + 5, 95));
		  }, 100);
	
		  const response = await fetch("/api/generate-pdf", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ blobsUrls }),
		  });
		  await Promise.all([
			...blobsUrls.map(async (url) => {
			  const fileName = url.split("/").pop();
			  if (fileName) await deleteFileFromSupabaseBucketCapsulesPdf(fileName, supabase);
			}),
		  ]);
		  if (!response || !response.ok) {
			setError("Échec de la récupération du PDF, réponse vide");
			return ({ blob: null, error: "Failed to get PDF, empty response" });
		  }
		  clearInterval(progressInterval);
		  const blob = await response.blob();
		  return ({blob, error: null});
		} catch (error) {
		  logger.error(
			"react:component",
			"CapsuleToPdfDialog",
			"Error downloading PDF:",
			error
		  );
		  await Promise.all([
			...blobsUrls.map(async (url) => {
			  const fileName = url.split("/").pop();
			  if (fileName) await deleteFileFromSupabaseBucketCapsulesPdf(fileName, supabase);
			}),
		  ]);
		} finally {
		  clearInterval(progressInterval);
		}
		return { blob: null, error: "An unexpected error occurred" };
	  };

	const getJPGBlobsUrl = async (editor: Editor): Promise<string[] | undefined> => {
		if (!editor) return;
		logger.log(
		  "react:component",
		  "CapsuleToPdfDialog",
		  "getJPGBlobsUrl",
		  "getting JPG blobs from all pages"
		);
		setProgress(0);
		const allPages = editor.getPages();
		const allUrls: string[] = [];
	
		if (allPages.length > 0) {
		  try {
			setPagesProgress({ loading: 0, total: allPages.length });
			for (let i = 0; i < allPages.length; i++) {
			  const shapeIds = editor.getPageShapeIds(allPages[i]);
			  if (shapeIds.size === 0)
				continue;
	
			  setPagesProgress((prev) => ({
				loading: prev.loading + 1,
				total: prev.total,
			  }));
	
			  try {
				const blob = await exportToBlob({
				  editor,
				  ids: Array.from(shapeIds),
				  format: "jpeg",
				  opts: {
					bounds: defaultBox,
					padding: 0,
					darkMode: false,
				  },
				});
	
				if (blob.size > 0) {
				  const url = await uploadToSupabaseBucketCapsulesPdf(
					blob,
					`slide_${Date.now()}_${i}.jpg`,
					supabase
				  );
				  if (url) allUrls.push(url);
				}
				setProgress((prev) =>
				  Math.min((prev || 0) + 100 / (allPages.length || 1), 100)
				);
			  } catch (error) {
				logger.error(
				  "react:component",
				  "CapsuleToPdfDialog",
				  "getJPGBlobsUrl",
				  `Failed to get blob in page ${allPages[i].id}`,
				  error
				);
				return;
			  }
			}
		  } catch (error) {
			logger.error(
			  "react:component",
			  "CapsuleToPdfDialog",
			  "getJPGBlobsUrl",
			  error
			);
			return;
		  }
		  return allUrls;
		}
	  };

    return { inProgress, pagesProgress, progress, generatePdf };
}