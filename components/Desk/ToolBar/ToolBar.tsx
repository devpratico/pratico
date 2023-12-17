import styles from './ToolBar.module.css'
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome';
import { faArrowPointer }   from '@fortawesome/free-solid-svg-icons';
import { faPen }            from '@fortawesome/free-solid-svg-icons';
import { faT }              from '@fortawesome/free-solid-svg-icons';
import { faShapes }         from '@fortawesome/free-solid-svg-icons';
import { faImage }          from '@fortawesome/free-solid-svg-icons';
import { faEraser }         from '@fortawesome/free-solid-svg-icons';

export default function ToolBar() {
    return (
        <div className={`${styles.container} bigShadow`}>
            <button className={styles.btn}><FontAwesomeIcon icon={faArrowPointer} /></button>
            <button className={styles.btn}><FontAwesomeIcon icon={faPen} /></button>
            <button className={styles.btn}><FontAwesomeIcon icon={faT} /></button>
            <button className={styles.btn}><FontAwesomeIcon icon={faShapes} /></button>
            <button className={styles.btn}><FontAwesomeIcon icon={faImage} /></button>
            <button className={styles.btn}><FontAwesomeIcon icon={faEraser} /></button>
        </div>
    )
}