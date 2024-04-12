import styles from './NavigationOption.module.css'
import RadioGroup from "@/app/[locale]/_components/primitives/RadioGroup/RadioGroup"
import { useState } from 'react'


export default function NavigationOption() {

    const [value, setValue] = useState('pratico')

    const radioGroupProps = {
        ariaLabel: 'Défilement',
        defaultValue: 'pratico',
        radios: [
            { value: 'pratico',   label: 'Pratico' },
            { value: 'animateur', label: 'Animateur' },
            { value: 'libre',     label: 'Libre' },
        ],
        onValueChange: (value: string) => setValue(value)
    }

    const explanations: { [key: string]: string } = {
        pratico: 'Les participants peuvent retourner sur les pages précédentes',
        animateur: 'Les participants voient la même page que l\'animateur',
        libre: 'Les participants ont accès à toutes les pages'
    }

    return (
        <div className={styles.container}>
            <RadioGroup {...radioGroupProps} />
            <div className={styles.rightBox}>
                {explanations[value]}
            </div>
        </div>
    )
}