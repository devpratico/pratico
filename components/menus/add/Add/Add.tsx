import styles from "./Add.module.css"
import DeskMenuLayout from "../../DeskMenuLayout/DeskMenuLayout"
import ImportPDFButton from "../ImportPdfBtn/ImportPdfBtn"


export default function Add() {
    return (
        <DeskMenuLayout menu="add">
            <div>
                <h2>Document</h2>
                <div className={styles.optionsContainer}>

                    <ImportPDFButton className={styles.option}>
                        <div className={styles.pdf}>
                            PDF
                        </div>
                    </ImportPDFButton>

                    <div className={styles.option}>
                        Image
                    </div>

                </div>
            </div>

            <div>
                <h2>Page</h2>
                <div className={styles.optionsContainer}>

                    <div className={styles.option}>
                        Page blanche
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