'use client'
import styles from "./Add.module.css"
import DeskMenuLayout from "../../DeskMenuLayout/DeskMenuLayout"
import ImportPDFButton from "../components/ImportPdfBtn/ImportPdfBtn"
import importPdfBackground from "@/utils/tldraw/importPdfBackground"
import CreatePageBtn from "../components/CreatePageBtn/CreatePageBtn"
import { useTLEditor } from "@/hooks/useTLEditor"
//import { useCapsule } from "@/hooks/useCapsule"
//import { NavProvider } from "@/hooks/navContext"
import { useParams } from "next/navigation"



export default function Add() {

    const { editor } = useTLEditor()
    //const { capsule } = useCapsule()
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()

    if (!editor) return null

    // TODO: NavProvider is provided at different places, maybe it should be provided at a higher level
    return (
        <DeskMenuLayout menu="add">
            <div>
                <h3>Document</h3>
                <div className={styles.optionsContainer}>

                    <ImportPDFButton
                        onImport={(file) => {
                            importPdfBackground({ file, editor, capsuleId})}
                        }
                        className={styles.option}
                    >
                        <div className={styles.pdf}>
                            PDF
                        </div>
                    </ImportPDFButton>


                </div>
            </div>

            <div>
                <h3>Templates</h3>
                <div className={styles.optionsContainer}>

                    <div className={styles.option}>
                        <CreatePageBtn />
                    </div>

                    <div className={styles.option}>
                        template 1
                    </div>

                    <div className={styles.option}>
                        template 2
                    </div>
                </div>
            </div>
        </DeskMenuLayout>
    )
}