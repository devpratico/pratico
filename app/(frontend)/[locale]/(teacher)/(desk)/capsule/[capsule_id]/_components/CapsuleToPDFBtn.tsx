"use client";
import { useTLEditor } from "@/app/(frontend)/_hooks/useTLEditor";
import { Button, Progress, Text } from "@radix-ui/themes";
import jsPDF from "jspdf";
import { FolderDown } from "lucide-react";
import { exportToBlob } from "tldraw";
import { defaultBox } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import createClient from "@/supabase/clients/client";
import logger from "@/app/_utils/logger";
import { formatDate } from "@/app/_utils/utils_functions";
import { useState } from "react";

export function CapsuleToPDFBtn({capsuleId, isRoom}: {capsuleId: string | string[], isRoom: boolean}) {
	const editor = useTLEditor().editor;
	const supabase = createClient();
	const [ disabled, setDisabled ] = useState(false);
	const [ progress, setProgress ] = useState(0);
	const [ halfwayProgress, setHalfwayProgress ] = useState(true);

	const getCapsuleData = async () => {
		const { data, error } = await supabase.from('capsules').select("title, created_at").eq('id', capsuleId).single();
		if (error)
			logger.error("react:component", "CapsuleToPDFBtn", "getCapsuleData", error);
		else
			return (data);
	};
	  
	const createPdf = async (blobs: Blob[], pdf: jsPDF) => {
		let pdfName = "capsule.pdf";
		const processBlob = async (index: number) => {
			if (index >= blobs.length) {
				if (!isRoom) {
					const data = await getCapsuleData();
					if (data) {
						const title = data?.title === "Sans titre" ? "capsule" : data?.title;
						pdfName = `${title}-${formatDate(data.created_at)}.pdf`;
					}
				}
				pdf.save(pdfName);
				setDisabled(false);
				setProgress(0);
				setHalfwayProgress(true);
				return ;
			}
			const blob = blobs[index];
			// const url = URL.createObjectURL(blob);
			// const image = new Image();
			// image.src = url;

			// image.onload = async () => {
			// 	try {
			// 		pdf.addImage(image, "WEBP", 0, 0, defaultBox.w, defaultBox.h);
			// 	} catch (error) {
			// 		logger.error("react:component", "CapsuleToPDFBtn", "pdf.addImage", index, error);
			// 	}

			// 	if (index < blobs.length - 1) {
			// 		pdf.addPage();
			// 	}

			// 	URL.revokeObjectURL(url);
			// 	setProgress((prev) => (prev || 0) + 100 / (blobs.length || 1));
			// 	const timeout = setTimeout(() => processBlob(index + 1), 100);
			// 	return (() => clearTimeout(timeout));
			// };

			// image.onerror = (error) => {
			// 	logger.error("react:component", "CapsuleToPDFBtn", "Image Load", index, error);
			// 	setDisabled(false);
			// };
			// } catch (error) {
			// 	logger.error("react:component", "CapsuleToPDFBtn", "Blob Processing", index, error);
			// 	setDisabled(false);
			// }
			const reader = new FileReader();
			setHalfwayProgress(false);
			reader.onload = async () => {
				const base64data = reader.result as string;
				try {
					pdf.addImage(base64data, "WEBP", 0, 0, defaultBox.w, defaultBox.h);
				} catch (error) {
					logger.error("react:component", "CapsuleToPDFBtn", "pdf.addImage", index, error);
				}

				if (index < blobs.length - 1) {
					pdf.addPage();
				}
				setProgress((prev) => (prev || 0) + 100 / (blobs.length || 1));

				const timeout = setTimeout(() => {processBlob(index + 1)}, 100);
				return (() => clearTimeout(timeout));
			};
			reader.onerror = (error) => {
				logger.error("react:component", "CapsuleToPDFBtn", "FileReader", index, error);
				setDisabled(false);
			};
			reader.readAsDataURL(blob);
		};

		try {
			processBlob(0);
		} catch (error) {
			logger.error("react:component", "CapsuleToPDFBtn", "createPdf", error);
			setDisabled(false);
		};
	}

	const handleExportAllPages = async () => {
		if (!editor)
			return ;
		setDisabled(true);
		const pdf = new jsPDF('landscape', 'px', [defaultBox.w, defaultBox.h]);
		const allBlobs: any[] = [];
		const allPages = editor.getPages();
		if (allPages.length === 0)
		{	
			setDisabled(false);
			return;
		}
		try {
			for (let i = 0; i < allPages.length; i++) {
			  const shapeIds = editor.getPageShapeIds(allPages[i]);
			  if (shapeIds.size === 0)
				continue;
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
			
				setProgress((prev) => (prev || 0) + 100 / (allPages.length || 1));

			  } catch (error) {
				logger.error("react:component", "CapsuleToPDFBtn", `Failed to get svgElement in page ${allPages[i].id}`, error);
				setDisabled(false);
			  }
			}
		} catch (error) {
			logger.error("react:component", "CapsuleToPDFBtn", "handleExportAllPages", error);
			setDisabled(false);
		}
		const validBlobs = allBlobs.filter(blob => blob.size > 0);
		setProgress(0);
		await createPdf(validBlobs, pdf);
	};
	  

  return (
	<>
		<Button style={{ width:"100%", justifyContent: 'center' }} onClick={handleExportAllPages} disabled={disabled}>
			<FolderDown size='15' /> Exporter la capsule en PDF
		</Button>
		{
			disabled
			? <>
				<Progress size="2" value={progress} />
				{
					halfwayProgress
					? <Text style={{ color: "var(--violet-9)", display: "flex", justifyContent: "end" }}>{"1/2"}</Text>
					: <Text style={{ color: "var(--violet-9)", display: "flex", justifyContent: "end" }}>{"2/2"}</Text>
				}
			</>
			: <></>
		}
	</>    
  );
}