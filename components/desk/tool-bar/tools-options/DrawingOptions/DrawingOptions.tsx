import styles from './DrawingOptions.module.css'
import ToolOptionsContainer from '../ToolOptionsContainer/ToolOptionsContainer'


export default function DrawingOptions() {
    return (
        <ToolOptionsContainer>
            <div className={styles.colorsContainer}>
                <div className={styles.colorPick + " " + styles.blue + " " + styles.colorSelected}/>
                <div className={styles.colorPick + " " + styles.red}/>
                <div className={styles.colorPick + " " + styles.green}/>
                <div className={styles.colorPick + " " + styles.violet}/>
            </div>
        </ToolOptionsContainer>
    )
}