"use client";
import { downloadCSV } from "@/app/_utils/csv";
import { useState } from "react";
import logger from "@/app/_utils/logger";


export default function useDownloadCsvReport(): {
    pending: boolean;
    downloadCsvReport: (type: "quiz" | "poll", startEventId: string) => Promise<{ error: string | null }>;
} {
    const [pending, setPending] = useState(false);

    const downloadCsvReport = async (type: "quiz" | "poll", startEventId: string) => {
        setPending(true);
        const response = await fetch(`/api/activity/csv/${startEventId}?type=${type}`);

        const res = await response.json();

        if (res.error) {
            logger.error('react:hook', 'useDownloadCsvReport.tsx', res.error);
            setPending(false);
            return { error: res.error };
        }

        if (!res.csvString) {
            logger.error('react:hook', 'useDownloadCsvReport.tsx', 'No csv string returned');
            setPending(false);
            return { error: 'No csv string returned' };
        }


        downloadCSV(res.csvString, `rapport-${type}-${startEventId}.csv`);
        setPending(false);
        return { error: null };
    };

    return { pending, downloadCsvReport };
}