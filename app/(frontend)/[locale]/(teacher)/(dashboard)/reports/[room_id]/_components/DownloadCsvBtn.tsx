"use client"
import { IconButton, IconButtonProps } from "@radix-ui/themes"
import useDownloadCsvReport from "@/app/(frontend)/_hooks/services/useDownloadCsvReport";
import { FileDown } from "lucide-react";

type DownloadCsvBtnProps = {
    type: 'poll' | 'quiz',
    startEventId: string
} & Omit<IconButtonProps, 'type' | 'onClick' | 'loading'>

export default function DownloadCsvBtn(props: DownloadCsvBtnProps) {
    const { type, startEventId, ...btnProps } = props;
    const { pending, downloadCsvReport } = useDownloadCsvReport();
    
    return (
        <IconButton
            onClick={() => downloadCsvReport(type, startEventId)}
            loading={pending}
            {...btnProps}    
        >
            <FileDown />
        </IconButton>
    )
}