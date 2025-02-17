"use client"
import { IconButton, IconButtonProps } from "@radix-ui/themes"
import useDownloadCsvReport from "@/app/(frontend)/_hooks/services/useDownloadCsvReport";
import { FileDown } from "lucide-react";


export default function DownloadCsvBtn(props: {
    startEventId: string
} & IconButtonProps) {
    const { startEventId, ...btnProps } = props;
    const { pending, downloadCsvReport } = useDownloadCsvReport();
    
    return (
        <IconButton
            onClick={() => downloadCsvReport(startEventId)}
            loading={pending}
            {...btnProps}    
        >
            <FileDown />
        </IconButton>
    )
}