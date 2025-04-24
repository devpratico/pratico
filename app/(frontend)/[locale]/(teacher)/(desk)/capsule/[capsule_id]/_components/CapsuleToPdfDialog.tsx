"use client";
import { defaultBox } from "@/app/(frontend)/[locale]/_components/canvases/custom-ui/Resizer";
import { useTLEditor } from "@/app/(frontend)/_hooks/contexts/useTLEditor";
import logger from "@/app/_utils/logger";
import createClient from "@/supabase/clients/client";
import {
  AlertDialog,
  Box,
  Button,
  Card,
  Flex,
  Progress,
  Text,
} from "@radix-ui/themes";
import { SupabaseClient } from "@supabase/supabase-js";
import { CircleAlert, CircleCheck, FileDown } from "lucide-react";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { exportToBlob } from "tldraw";

export function CapsuleToPdfDialog({
  capsuleId,
  isRoom,
}: {
  capsuleId: string;
  isRoom: boolean;
}) {
  const { editor } = useTLEditor();
  const supabase = createClient();
  const formatter = useFormatter();
  const [progress, setProgress] = useState(0);
  const [filename, setFilename] = useState("capsule.pdf");
  const [pagesProgress, setPagesProgress] = useState<{
    loading: number;
    total: number;
  }>({ loading: 0, total: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [state, setState] = useState<"loading" | "downloading" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getJPGBlobsUrl = async (): Promise<string[] | undefined> => {
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
          if (shapeIds.size === 0) continue;

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

  const handleExportAllPages = async () => {
    const blobsUrls = await getJPGBlobsUrl();
    if (!blobsUrls || blobsUrls.length === 0) {
      setErrorMsg("Échec de la récupération des données de la capsule");
      setState("error");
      setOpenDialog(false);
      return;
    }
    setState("downloading");
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
        setErrorMsg("Échec de la récupération du PDF, réponse vide");
        setState("error");
        setOpenDialog(false);
        throw new Error("Failed to fetch PDF");
      }
      clearInterval(progressInterval);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setOpenDialog(false);
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
      setOpenDialog(false);
    } finally {
      clearInterval(progressInterval);
    }
  };

  useEffect(() => {
    const getCapsuleData = async () => {
      const { data, error } = await supabase
        .from("capsules")
        .select("title, created_at")
        .eq("id", capsuleId)
        .single();
      if (error)
        logger.error(
          "react:component",
          "CapsuleToPDFBtn",
          "getCapsuleData",
          error
        );
      else return data;
    };
    (async () => {
      if (!isRoom) {
        const data = await getCapsuleData();
        if (data?.title) {
          if (data?.title === "Sans titre")
            setFilename(
              `capsule-${formatter
                .dateTime(new Date(data.created_at), {
                  dateStyle: "short",
                  timeStyle: "short",
                })
                .replace(/[\/:]/g, "")
                .replace(" ", "-")}.pdf`
            );
          else {
            const title = data?.title
              .normalize("NFD") // Decomposes accented characters into base characters and diacritical marks
              .replace(/[\u0300-\u036f]/g, "") // Removes diacritical marks
              .replace(/[^a-zA-Z0-9]/g, "_"); // Replaces non-alphanumeric characters with underscores
            setFilename(
              `${title}-${formatter
                .dateTime(new Date(data.created_at), {
                  dateStyle: "short",
                  timeStyle: "short",
                })
                .replace(/[\/:]/g, "")
                .replace(" ", "-")}.pdf`
            );
          }
        }
      }
    })();
  }, [isRoom, capsuleId, supabase, formatter]);

  return (
    <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialog.Trigger>
        <Button
          style={{ width: "100%", justifyContent: "center" }}
          onClick={handleExportAllPages}
        >
          <FileDown size="20" style={{ marginRight: "5px" }} />
          <Text>Télécharger en PDF</Text>
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>
          Génération de votre capsule en PDF
        </AlertDialog.Title>
        <AlertDialog.Description />

        <Card variant="surface" my="4">
          {/* ERROR */}
          <Flex
            direction="column"
            align="center"
            gap="3"
            display={state == "error" ? "flex" : "none"}
          >
            <Flex align="center" gap="1" style={{ color: "var(--red)" }}>
              <CircleAlert size="15" style={{ color: "var(--red)" }} />
              <Text trim="both">{`${
                errorMsg ? errorMsg : "Une erreur s'est produite"
              }`}</Text>
            </Flex>
          </Flex>

          {/* LOADING */}
          <Flex
            direction="column"
            align="center"
            gap="3"
            display={state == "loading" ? "flex" : "none"}
          >
            <Flex
              align="center"
              justify="between"
              gap="1"
              width="100%"
              style={{ color: "var(--gray-10)" }}
            >
              <Text trim="both">{filename}</Text>
              <Text size="1">{`Conversion page ${pagesProgress.loading} sur ${pagesProgress.total}`}</Text>
            </Flex>

            <Box width="100%">
              <Progress value={progress} />
            </Box>
          </Flex>

          {/* DOWNLOADING */}
          <Flex
            direction="column"
            align="center"
            gap="3"
            display={state == "downloading" ? "flex" : "none"}
          >
            <Flex
              mb="5"
              align="center"
              gap="1"
              style={{ color: "var(--green)" }}
            >
              <CircleCheck size="15" style={{ color: "var(--green)" }} />
              <Text trim="both">{`Conversion réussie, téléchargement du PDF en cours...`}</Text>
            </Flex>
            <Flex
              align="center"
              justify="between"
              gap="1"
              width="100%"
              style={{ color: "var(--gray-10)" }}
            >
              <Text trim="both">{filename}</Text>
              {/* <Text size='1'>{`Chargement page ${pagesProgress.loading} sur ${pagesProgress.total}`}</Text> */}
            </Flex>

            <Box width="100%">
              <Progress value={progress} />
            </Box>
          </Flex>
        </Card>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

function deletePdfFiles(pdfDir: string) {
    fetch('/api/generate-pdf', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pdfDir })
    })
    .then(response => response.json())
    .then(data => {
      logger.log("react:component", "CapsuleToPdfDialog", "deletePdfFiles", "PDF files deleted", data.message);
    })
    .catch(error => {
      logger.error("react:component", "CapsuleToPdfDialog", "deletePdfFiles", "error while deleting files", error.message);
    });
  }

  
  export const uploadToSupabaseBucketCapsulesPdf = async (
    blob: Blob,
    fileName: string,
    supabase: SupabaseClient
  ): Promise<string | null> => {
    const { error } = await supabase.storage
      .from("capsules_pdf")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      logger.error("react:component", "uploadToSupabase", error.message);
      return null;
    }

    return supabase.storage.from("capsules_pdf").getPublicUrl(fileName).data
      .publicUrl;
  };

  export const deleteFileFromSupabaseBucketCapsulesPdf = async (filePath: string, supabase: SupabaseClient) => {
    const { error } = await supabase.storage
      .from("capsules_pdf")
      .remove([filePath]);

    if (error)
      logger.error(
        "react:component",
        "CapsuleToPdfDialog",
        "deleteFileFromSupabaseBucket",
        error.message
      );
  };