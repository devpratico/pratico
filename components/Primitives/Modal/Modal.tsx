'use client'
import styles from './Modal.module.css';
import * as Dialog from '@radix-ui/react-dialog';


interface ModalProps {
    button: React.ReactNode;
    content: React.ReactNode;
    position: 'center' | 'top' | 'bottom' | 'left' | 'right';
    overlayBlur?: boolean;
    contentBlur?: boolean;
}


export default function Modal({ button, content, position, overlayBlur, contentBlur }: ModalProps) {

    const positionClass = styles[position];
    const contentClassesArr = [styles.content, positionClass, "bigShadow"];
    if (contentBlur) contentClassesArr.push(styles.modalBlur);
    const contentClasses = contentClassesArr.join(" ");


    const overlayClassesArr = [styles.overlay];
    if (overlayBlur) overlayClassesArr.push(styles.overlayBlur);
    const overlayClasses = overlayClassesArr.join(" ");

    return (
        <Dialog.Root>

            <Dialog.Trigger className={styles.trigger}>
                {button}
            </Dialog.Trigger>

            <Dialog.Overlay className={overlayClasses}/>

            <Dialog.Content className={contentClasses}>

                {/*<Dialog.Close className={styles.close}>X</Dialog.Close>

                <Dialog.Title className={styles.title}>Hello</Dialog.Title>

                <Dialog.Description className={styles.description}>
                    This is a modal
                </Dialog.Description>*/}

                {content}

            </Dialog.Content>

        </Dialog.Root>
    )
}