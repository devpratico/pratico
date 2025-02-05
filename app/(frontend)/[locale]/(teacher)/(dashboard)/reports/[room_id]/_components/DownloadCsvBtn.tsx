"use client"
import { IconButton, IconButtonProps } from "@radix-ui/themes"
import { downloadCSV } from "@/app/_utils/csv"


export default function DownloadCsvBtn(props: IconButtonProps) {

    const onClick = () => {
        console.log("Download CSV");
    }
    
    return (
        <IconButton onClick={onClick} {...props} />
    )
}